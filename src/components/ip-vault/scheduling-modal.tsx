import { CalendarDays, Check, Clock3, MailCheck, ShieldCheck, Video } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { Appointment, Prospect } from "@/lib/ip-vault";

const TIME_SLOTS = ["09:00", "10:30", "12:00", "15:00", "16:30"];

function availableDates() {
  const dates: Date[] = [];
  const cursor = new Date();
  cursor.setHours(12, 0, 0, 0);
  while (dates.length < 5) {
    cursor.setDate(cursor.getDate() + 1);
    if (cursor.getDay() !== 0 && cursor.getDay() !== 6) dates.push(new Date(cursor));
  }
  return dates;
}

export function SchedulingModal({
  open,
  onOpenChange,
  company,
  prospect,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  company: string;
  prospect: Prospect;
  onConfirm: (appointment: Appointment) => void;
}) {
  const dates = useMemo(availableDates, []);
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedDate, setSelectedDate] = useState(dates[0]?.toISOString().slice(0, 10) ?? "");
  const [selectedTime, setSelectedTime] = useState("10:30");
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    if (!open) {
      setStep(1);
      setConfirmed(false);
    }
  }, [open]);

  const selectedDateObject = dates.find((date) => date.toISOString().slice(0, 10) === selectedDate);
  const formattedDate = selectedDateObject
    ? new Intl.DateTimeFormat("es-ES", {
        weekday: "long",
        day: "numeric",
        month: "long",
      }).format(selectedDateObject)
    : "";

  function confirmAppointment() {
    const startsAt = new Date(`${selectedDate}T${selectedTime}:00`);
    const appointment: Appointment = {
      startsAt: startsAt.toISOString(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      durationMinutes: 20,
      confirmedAt: new Date().toISOString(),
    };
    onConfirm(appointment);
    setConfirmed(true);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-panel max-h-[92vh] max-w-3xl overflow-y-auto border-primary/40 p-0 shadow-[var(--shadow-primary)]">
        <div className="border-b border-border bg-primary/5 px-6 py-5 sm:px-8">
          <DialogHeader>
            <div className="mb-3 flex items-center gap-2 font-mono text-xs text-primary">
              <ShieldCheck className="size-4" /> DESBLOQUEO SUPERVISADO
            </div>
            <DialogTitle className="text-2xl">Sesión de arquitectura para {company}</DialogTitle>
            <DialogDescription>
              Reserva 20 minutos con un Ingeniero de Software Principal. No se enviará ninguna
              notificación real en esta demostración.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-5 grid grid-cols-2 gap-2 text-xs">
            <div
              className={cn(
                "rounded-md border px-3 py-2",
                step === 1 && "border-primary bg-primary/10 text-primary",
              )}
            >
              01 · Fecha y hora
            </div>
            <div
              className={cn(
                "rounded-md border px-3 py-2",
                step === 2 && "border-primary bg-primary/10 text-primary",
              )}
            >
              02 · Confirmación
            </div>
          </div>
        </div>

        {step === 1 ? (
          <div className="grid gap-7 p-6 sm:p-8 lg:grid-cols-[1.1fr_.9fr]">
            <div>
              <p className="mb-4 flex items-center gap-2 text-sm font-semibold">
                <CalendarDays className="size-4 text-cyan" /> Selecciona una fecha
              </p>
              <div className="grid gap-2 sm:grid-cols-5 lg:grid-cols-1">
                {dates.map((date) => {
                  const value = date.toISOString().slice(0, 10);
                  const active = selectedDate === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setSelectedDate(value)}
                      className={cn(
                        "rounded-md border px-4 py-3 text-left text-sm transition-colors hover:border-primary/60",
                        active && "border-primary bg-primary/10 text-primary",
                      )}
                      aria-pressed={active}
                    >
                      <span className="block font-semibold capitalize">
                        {new Intl.DateTimeFormat("es-ES", { weekday: "short" }).format(date)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Intl.DateTimeFormat("es-ES", {
                          day: "numeric",
                          month: "short",
                        }).format(date)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <p className="mb-4 flex items-center gap-2 text-sm font-semibold">
                <Clock3 className="size-4 text-cyan" /> Horarios disponibles
              </p>
              <div className="grid grid-cols-2 gap-2">
                {TIME_SLOTS.map((time) => (
                  <Button
                    key={time}
                    type="button"
                    variant={selectedTime === time ? "default" : "outline"}
                    aria-pressed={selectedTime === time}
                    onClick={() => setSelectedTime(time)}
                  >
                    {time}
                  </Button>
                ))}
              </div>
              <div className="mt-5 rounded-md border border-cyan/20 bg-cyan/5 p-4 text-xs leading-5 text-muted-foreground">
                <Video className="mb-2 size-4 text-cyan" /> Videollamada privada · 20 min · Zona
                horaria local
              </div>
            </div>
            <Button className="lg:col-span-2" size="lg" onClick={() => setStep(2)}>
              Revisar reserva
            </Button>
          </div>
        ) : confirmed ? (
          <div className="p-8 text-center">
            <span className="mx-auto grid size-14 place-items-center rounded-full bg-primary/10 text-primary">
              <MailCheck className="size-7" />
            </span>
            <h3 className="mt-5 text-2xl font-bold">Sesión confirmada</h3>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted-foreground">
              Notificación simulada enviada a {prospect.email || "tu correo corporativo"}. La bóveda
              recibió 48 horas adicionales de acceso.
            </p>
            <Button className="mt-6" onClick={() => onOpenChange(false)}>
              Ver repositorio desbloqueado
            </Button>
          </div>
        ) : (
          <div className="p-6 sm:p-8">
            <div className="grid gap-4 rounded-lg border border-primary/30 bg-primary/5 p-5 sm:grid-cols-2">
              <Summary label="Empresa" value={company} />
              <Summary
                label="Participante"
                value={prospect.name || prospect.email || "Prospecto"}
              />
              <Summary label="Fecha" value={formattedDate} />
              <Summary label="Hora" value={`${selectedTime} · 20 minutos`} />
            </div>
            <div className="mt-5 flex items-start gap-3 rounded-md border border-border p-4 text-sm text-muted-foreground">
              <Check className="mt-0.5 size-4 shrink-0 text-primary" />
              Al confirmar, IP Vault simulará el envío de la invitación y ampliará el acceso al
              repositorio durante 48 horas.
            </div>
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button variant="outline" onClick={() => setStep(1)}>
                Cambiar horario
              </Button>
              <Button onClick={confirmAppointment}>Confirmar y desbloquear</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-semibold capitalize">{value}</p>
    </div>
  );
}
