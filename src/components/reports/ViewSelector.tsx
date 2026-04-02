import Title from "@components/layout/Title.tsx";
import ReportsList from "./ReportsList";

export default function ViewSelector() {
  return (
    <div className="min-h-screen min-w-0 max-w-full overflow-x-hidden bg-slate-50">
      <div className="mx-auto max-w-7xl min-w-0 px-3 py-6 sm:px-4 sm:py-8">
        <div className="mb-6 text-center sm:mb-8 sm:text-left">
          <Title as="h1" size="md">
            Reportes Financieros
          </Title>
          <p className="mt-1 text-[15px] text-slate-600">
            Filtra por año y mes o revisa el historial completo.
          </p>
        </div>

        <ReportsList />
      </div>
    </div>
  );
}
