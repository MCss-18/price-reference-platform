export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
      <h1 className="text-4xl font-bold mb-2">404 - Página no encontrada</h1>
      <p className="mb-4 text-gray-600">
        Lo sentimos, la página que buscas no existe o no tienes permisos para acceder.
      </p>
    </div>
  );
}