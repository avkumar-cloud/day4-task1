// components/AuthCard.tsx
export default function AuthCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      <div className="w-full max-w-md bg-gray-900 p-8 rounded-xl shadow-lg">
        {children}
      </div>
    </div>
  );
}
