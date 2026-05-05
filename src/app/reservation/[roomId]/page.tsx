"use client";

import { createReservation, fetchRoom, fetchRoomReservations } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { Reservation, Room } from "@/types/reservation";
import axios from "axios";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const TIME_SLOTS = Array.from({ length: 13 }, (_, i) => {
  const hour = i + 9;
  return `${hour.toString().padStart(2, "0")}:00`;
});

const TEXT = {
  loading: "\ub85c\ub529 \uc911...",
  loadError:
    "\uc2a4\ud130\ub514\ub8f8 \uc815\ubcf4\ub97c \ubd88\ub7ec\uc624\ub294\ub370 \uc2e4\ud328\ud588\uc2b5\ub2c8\ub2e4.",
  dateLabel: "\ub0a0\uc9dc \uc120\ud0dd",
  timetableTitle: "\uc2dc\uac04\ud45c",
  reserved: "\uc608\uc57d\ub428",
  available: "\ube48 \uc2dc\uac04",
  selected: "\uc120\ud0dd\ub428",
  login: "\ub85c\uadf8\uc778",
  loginRequiredSuffix:
    " \ud6c4 \uc608\uc57d\ud560 \uc218 \uc788\uc2b5\ub2c8\ub2e4.",
  selectedTime: "\uc120\ud0dd\ud55c \uc2dc\uac04",
  purposeLabel: "\uc608\uc57d \ubaa9\uc801",
  purposePlaceholder: "\uc608\uc57d \ubaa9\uc801\uc744 \uc785\ub825\ud574\uc8fc\uc138\uc694.",
  reserveButton: "\uc608\uc57d\ud558\uae30",
  reservingButton: "\uc608\uc57d \uc911...",
  missingInput:
    "\uc2dc\uac04\uacfc \uc608\uc57d \ubaa9\uc801\uc744 \uc785\ub825\ud574\uc8fc\uc138\uc694.",
  reserveSuccess: "\uc608\uc57d\uc774 \uc644\ub8cc\ub418\uc5c8\uc2b5\ub2c8\ub2e4!",
  reserveFailure: "\uc608\uc57d\uc5d0 \uc2e4\ud328\ud588\uc2b5\ub2c8\ub2e4.",
  capacitySuffix: "\uc778",
};

interface BusinessErrorResponse {
  detail?: {
    error?: string;
  };
}

const getToday = () => new Date().toISOString().split("T")[0];

export default function RoomReservationPage() {
  const params = useParams<{ roomId: string }>();
  const roomId = params.roomId;
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const initialize = useAuthStore((state) => state.initialize);
  const [room, setRoom] = useState<Room | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [selectedDate, setSelectedDate] = useState(getToday);
  const [selectedStart, setSelectedStart] = useState<string | null>(null);
  const [selectedEnd, setSelectedEnd] = useState<string | null>(null);
  const [purpose, setPurpose] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getReservationForSlot = useMemo(
    () => (time: string) => {
      return reservations.find((r) => r.startTime <= time && r.endTime > time);
    },
    [reservations]
  );

  const handleSlotClick = (time: string) => {
    if (getReservationForSlot(time)) return;
    if (!isLoggedIn) return;

    if (!selectedStart || (selectedStart && selectedEnd)) {
      setSelectedStart(time);
      const nextHour = `${(parseInt(time) + 1).toString().padStart(2, "0")}:00`;
      setSelectedEnd(nextHour);
      return;
    }

    const endTime = `${(parseInt(time) + 1).toString().padStart(2, "0")}:00`;
    if (endTime > selectedStart) {
      setSelectedEnd(endTime);
    }
  };

  const isSelectedSlot = (time: string) => {
    return Boolean(selectedStart && selectedEnd && time >= selectedStart && time < selectedEnd);
  };

  const handleReserve = async () => {
    if (!selectedStart || !selectedEnd || !purpose.trim()) {
      alert(TEXT.missingInput);
      return;
    }

    setSubmitting(true);
    try {
      await createReservation({
        roomId,
        date: selectedDate,
        startTime: selectedStart,
        endTime: selectedEnd,
        purpose,
      });
      alert(TEXT.reserveSuccess);

      const updated = await fetchRoomReservations(roomId, selectedDate);
      setReservations(updated);
      setSelectedStart(null);
      setSelectedEnd(null);
      setPurpose("");
    } catch (err) {
      const message =
        axios.isAxiosError<BusinessErrorResponse>(err)
          ? err.response?.data?.detail?.error
          : null;
      alert(message || TEXT.reserveFailure);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    const loadRoom = async () => {
      try {
        const data = await fetchRoom(roomId);
        setRoom(data);
      } catch {
        setError(TEXT.loadError);
      } finally {
        setLoading(false);
      }
    };

    void loadRoom();
  }, [roomId]);

  useEffect(() => {
    const loadReservations = async () => {
      try {
        const data = await fetchRoomReservations(roomId, selectedDate);
        setReservations(data);
      } catch {
        setError(TEXT.loadError);
      }
    };

    void loadReservations();
    setSelectedStart(null);
    setSelectedEnd(null);
  }, [roomId, selectedDate]);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-12">
        <div className="mx-auto max-w-4xl rounded-xl border border-slate-200 bg-white p-8 text-center text-sm font-medium text-slate-500 shadow-sm">
          {TEXT.loading}
        </div>
      </main>
    );
  }

  if (error || !room) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-12">
        <div className="mx-auto max-w-4xl rounded-xl border border-red-100 bg-red-50 p-8 text-center text-sm font-medium text-red-600">
          {error || TEXT.loadError}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-4xl">
        <section className="mb-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {room.name}
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            {room.location} / {room.capacity}
            {TEXT.capacitySuffix}
          </p>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-semibold text-slate-900">
              {TEXT.timetableTitle}
            </h2>
            <label className="flex items-center gap-3 text-sm font-medium text-slate-600">
              {TEXT.dateLabel}
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition-colors focus:border-indigo-400"
              />
            </label>
          </div>

          <div className="overflow-hidden rounded-lg border border-slate-200">
            {TIME_SLOTS.map((time) => {
              const reservation = getReservationForSlot(time);
              const isSelected = isSelectedSlot(time);

              return (
                <div
                  key={time}
                  onClick={() => handleSlotClick(time)}
                  className={`flex items-center border-b border-slate-100 p-3 last:border-b-0 ${
                    reservation
                      ? "cursor-not-allowed bg-slate-200"
                      : isSelected
                        ? "cursor-pointer bg-indigo-100"
                        : "cursor-pointer bg-white hover:bg-slate-50"
                  }`}
                >
                  <span className="w-16 font-mono text-sm font-semibold text-slate-700">
                    {time}
                  </span>
                  <span className="flex-1 text-sm text-slate-700">
                    {reservation ? (
                      `${reservation.purpose} (${reservation.username})`
                    ) : isSelected ? (
                      TEXT.selected
                    ) : (
                      ""
                    )}
                  </span>
                </div>
              );
            })}
          </div>

          {isLoggedIn ? (
            <div className="mt-5 space-y-3">
              {selectedStart && selectedEnd ? (
                <p className="rounded-lg border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm font-medium text-indigo-700">
                  {TEXT.selectedTime}: {selectedStart} - {selectedEnd}
                </p>
              ) : null}
              <label className="block text-sm font-semibold text-slate-700">
                {TEXT.purposeLabel}
              </label>
              <input
                type="text"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder={TEXT.purposePlaceholder}
                className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-indigo-400"
              />
              <button
                type="button"
                onClick={handleReserve}
                disabled={
                  !selectedStart || !selectedEnd || !purpose.trim() || submitting
                }
                className="inline-flex h-11 items-center justify-center rounded-lg bg-indigo-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {submitting ? TEXT.reservingButton : TEXT.reserveButton}
              </button>
            </div>
          ) : (
            <p className="mt-5 text-sm text-slate-500">
              <Link href="/login" className="font-semibold text-indigo-600 underline">
                {TEXT.login}
              </Link>
              {TEXT.loginRequiredSuffix}
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
