"use client";

import { fetchRooms } from "@/lib/api";
import { Room } from "@/types/reservation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const TEXT = {
  title: "\uc2a4\ud130\ub514\ub8f8 \uc608\uc57d",
  subtitle:
    "\uc6d0\ud558\ub294 \uc2a4\ud130\ub514\ub8f8\uc744 \uc120\ud0dd\ud558\uace0 \uc608\uc57d \uac00\ub2a5\ud55c \uc2dc\uac04\uc744 \ud655\uc778\ud558\uc138\uc694.",
  myReservations: "\ub0b4 \uc608\uc57d \ubcf4\uae30",
  back: "\u2190 \ub4a4\ub85c\uac00\uae30",
  loading: "\ub85c\ub529 \uc911...",
  loadError:
    "\uc2a4\ud130\ub514\ub8f8 \ubaa9\ub85d\uc744 \ubd88\ub7ec\uc624\ub294\ub370 \uc2e4\ud328\ud588\uc2b5\ub2c8\ub2e4.",
  empty: "\ub4f1\ub85d\ub41c \uc2a4\ud130\ub514\ub8f8\uc774 \uc5c6\uc2b5\ub2c8\ub2e4.",
  reserve: "\uc608\uc57d",
  capacitySuffix: "\uc778",
};

export default function ReservationPage() {
  const router = useRouter();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadRooms = async () => {
      try {
        const data = await fetchRooms();
        setRooms(data);
      } catch {
        setError(TEXT.loadError);
      } finally {
        setLoading(false);
      }
    };

    void loadRooms();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-12">
        <div className="mx-auto max-w-5xl rounded-xl border border-slate-200 bg-white p-8 text-center text-sm font-medium text-slate-500 shadow-sm">
          {TEXT.loading}
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-12">
        <div className="mx-auto max-w-5xl rounded-xl border border-red-100 bg-red-50 p-8 text-center text-sm font-medium text-red-600">
          {error}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <button
          type="button"
          onClick={() => router.back()}
          className="mb-8 inline-flex rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-900"
        >
          {TEXT.back}
        </button>
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {TEXT.title}
            </h1>
            <p className="mt-2 text-sm text-slate-500">{TEXT.subtitle}</p>
          </div>
          <button
            type="button"
            onClick={() => router.push("/reservation/my")}
            className="inline-flex h-10 items-center justify-center rounded-lg bg-slate-900 px-4 text-sm font-semibold text-white transition-colors hover:bg-slate-700"
          >
            {TEXT.myReservations}
          </button>
        </div>

        {rooms.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 shadow-sm">
            {TEXT.empty}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {rooms.map((room) => (
              <button
                key={room.id}
                type="button"
                onClick={() => router.push(`/reservation/${room.id}`)}
                className="group flex h-full flex-col rounded-xl border border-slate-200 bg-white p-5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h2 className="truncate text-lg font-semibold text-slate-900 group-hover:text-indigo-600">
                      {room.name}
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      {room.location} / {room.capacity}
                      {TEXT.capacitySuffix}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
                    {TEXT.reserve}
                  </span>
                </div>

                <p className="mt-4 line-clamp-2 flex-1 text-sm leading-relaxed text-slate-600">
                  {room.description}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {room.amenities.map((amenity) => (
                    <span
                      key={amenity}
                      className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
