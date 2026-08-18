import { useEffect, useState } from "react";
import QRCode from "qrcode";

type Props = {
  value: string;
  size?: number;
  label?: string;
};

export function QrCode({ value, size = 180, label }: Props) {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    QRCode.toDataURL(value, {
      width: size * 2,
      margin: 1,
      color: { dark: "#0a0a0c", light: "#ffffff" },
    })
      .then((url) => {
        if (alive) setSrc(url);
      })
      .catch(() => setSrc(null));
    return () => {
      alive = false;
    };
  }, [value, size]);

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="grid place-items-center rounded-xl bg-white p-2"
        style={{ width: size, height: size, boxShadow: "var(--glow-red)" }}
      >
        {src ? (
          <img src={src} alt="QR Code" width={size} height={size} className="h-full w-full" />
        ) : (
          <span className="text-[10px] uppercase tracking-widest text-black/50">Gerando…</span>
        )}
      </div>
      {label && (
        <p className="text-center text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
          {label}
        </p>
      )}
    </div>
  );
}
