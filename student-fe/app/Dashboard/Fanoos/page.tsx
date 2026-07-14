export default function FanoosPage() {
  return <PlaceholderPage name="فانوس" />;
}

function PlaceholderPage({ name }: { name: string }) {
  return (
    <div dir="rtl" className="flex items-center justify-center min-h-[60vh]">
      <div className="rounded-[18px] bg-white shadow-sm border border-[#EEF0F4] px-10 py-12 text-center">
        <p className="text-[22px] font-bold text-[#1A2B45]">این صفحه‌ی {name} است</p>
      </div>
    </div>
  );
}
