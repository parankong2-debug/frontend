"use client";

import { cancelReservation, fetchMyReservations, fetchRoom } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { Reservation } from "@/types/reservation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const TEXT = {
  loading: "\ub85c\ub529 \uc911...",
  title: "\ub0b4 \uc608\uc57d",
  backToList: "\u2190 \ubaa9\ub85d\uc73c\ub85c",
  upcoming: "\ub2e4\uac00\uc624\ub294 \uc608\uc57d",
  past: "\uc9c0\ub09c \uc608\uc57d",
  emptyUpcoming: "\uc608\uc57d\uc774 \uc5c6\uc2b5\ub2c8\ub2e4.",
  emptyPast: "\uc9c0\ub09c \uc608\uc57d\uc774 \uc5c6\uc2b5\ub2c8\ub2e4.",
  emptyAll: "\uc544\uc9c1 \uc608\uc57d \ub0b4\uc5ed\uc774 \uc5c6\uc2b5\ub2c8\ub2e4.",
  cancel: "\ucde8\uc18c",
  cancelConfirm: "\uc608\uc57d\uc744 \ucde8\uc18c\ud558\uc2dc\uaca0\uc2b5\ub2c8\uae4c?",
  cancelFailure: "\uc608\uc57d \ucde8\uc18c\uc5d0 \uc2e4\ud328\ud588\uc2b5\ub2c8\ub2e4.",
  loadFailure:
    "\uc608\uc57d \ubaa9\ub85d\uc744 \ubd88\ub7ec\uc624\ub294\ub370 \uc2e4\ud328\ud588\uc2b5\ub2c8\ub2e4.",
  roomFallback: "\uc2a4\ud130\ub514\ub8f8",
};

const getToday = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = `${today.getMonth() + 1}`.padStart(2, "0");
  const day = `${today.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const fillMissingRoomNames = async (
  reservations: Reservation[]
): Promise<Reservation[]> => {
  const missingRoomIds = Array.from(
    new Set(
      reservations
        .filter((reservation) => !reservation.roomName)
        .map((reservation) => reservation.roomId)
    )
  );

  if (missingRoomIds.length === 0) return reservations;

  const roomEntries = await Promise.all(
    missingRoomIds.map(async (roomId) => {
      const room = await fetchRoom(roomId);
      return [roomId, room.name] as const;
    })
  );
  const roomNameMap = new Map(roomEntries);

  return reservations.map((reservation) => ({
    ...reservation,
    roomName: reservation.roomName ?? roomNameMap.get(reservation.roomId),
  }));
};

export default function MyReservationsPage() {
  const router = useRouter();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const initialize = useAuthStore((state) => state.initialize);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadReservations = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await fetchMyReservations();
      const reservationsWithRoomNames = await fillMissingRoomNames(data);
      setReservations(reservationsWithRoomNames);
    } catch {
      setError(TEXT.loadFailure);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initialize();

    if (!useAuthStore.getState().isLoggedIn) {
      router.replace("/login");
      return;
    }

    void loadReservations();
  }, [initialize, router]);

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      router.replace("/login");
    }
  }, [isLoggedIn, loading, router]);

  const handleCancel = async (id: string) => {
    if (!confirm(TEXT.cancelConfirm)) return;

    try {
      await cancelReservation(id);
      setReservations((prev) => prev.filter((reservation) => reservation.id !== id));
    } catch {
      alert(TEXT.cancelFailure);
    }
  };

  const today = getToday();
  const upcoming = reservations.filter((reservation) => reservation.date >= today);
  const past = reservations.filter((reservation) => reservation.date < today);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-12">
        <div className="mx-auto max-w-3xl rounded-xl border border-slate-200 bg-white p-8 text-center text-sm font-medium text-slate-500 shadow-sm">
          {TEXT.loading}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <button
          type="button"
          onClick={() => router.push("/reservation")}
          className="mb-4 inline-flex rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-900"
        >
          {TEXT.backToList}
        </button>
        <header className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {TEXT.title}
          </h1>
        </header>

        {error ? (
          <p className="mb-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
            {error}
          </p>
        ) : null}

        {!error && reservations.length === 0 ? (
          <section className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 shadow-sm">
            {TEXT.emptyAll}
          </section>
        ) : (
          <>
            <ReservationSection
              title={TEXT.upcoming}
              emptyMessage={TEXT.emptyUpcoming}
              reservations={upcoming}
              onCancel={handleCancel}
              showCancel
            />

            <ReservationSection
              title={TEXT.past}
              emptyMessage={TEXT.emptyPast}
              reservations={past}
              onCancel={handleCancel}
            />
          </>
        )}
      </div>
    </main>
  );
}

interface ReservationSectionProps {
  title: string;
  emptyMessage: string;
  reservations: Reservation[];
  onCancel: (id: string) => void;
  showCancel?: boolean;
}

function ReservationSection({
  title,
  emptyMessage,
  reservations,
  onCancel,
  showCancel = false,
}: ReservationSectionProps) {
  return (
    <section className="mb-8">
      <h2 className="mb-3 text-lg font-semibold text-slate-900">{title}</h2>
      {reservations.length === 0 ? (
        <p className="rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-500 shadow-sm">
          {emptyMessage}
        </p>
      ) : (
        <div className="space-y-3">
          {reservations.map((reservation) => (
            <div
              key={reservation.id}
              className={`rounded-xl border border-slate-200 bg-white p-5 shadow-sm ${
                showCancel ? "" : "opacity-60"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-semibold text-slate-900">
                    {reservation.roomName || TEXT.roomFallback}
                  </p>
                  <p className="mt-1 text-sm tabular-nums text-slate-500">
                    {reservation.date} {reservation.startTime} - {reservation.endTime}
                  </p>
                  <p className="mt-2 text-sm text-slate-700">{reservation.purpose}</p>
                </div>

                {showCancel ? (
                  <button
                    type="button"
                    onClick={() => onCancel(reservation.id)}
                    className="shrink-0 rounded-lg border border-red-100 px-3 py-1.5 text-sm font-semibold text-red-500 transition-colors hover:bg-red-50 hover:text-red-700"
                  >
                    {TEXT.cancel}
                  </button>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
