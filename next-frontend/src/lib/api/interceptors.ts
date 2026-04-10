import { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { toast } from 'sonner';

/**
 * Setup de interceptors para el cliente Axios
 */
export function setupInterceptors(
  apiClient: AxiosInstance,
  refreshClient: AxiosInstance
): void {
  // ============================================
  // REQUEST INTERCEPTOR
  // ============================================
  apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // Log para desarrollo
      if (process.env.NODE_ENV === 'development') {
        console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
      }
      return config;
    },
    (error: AxiosError) => {
      console.error('❌ Request Error:', error);
      return Promise.reject(error);
    }
  );

  // ============================================
  // RESPONSE INTERCEPTOR
  // ============================================
  apiClient.interceptors.response.use(
    (response: AxiosResponse) => {
      // Log para desarrollo
      if (process.env.NODE_ENV === 'development') {
        console.log(`✅ API Response: ${response.config.url}`, response.data);
      }
      return response;
    },
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

      // Si no hay respuesta (error de red)
      if (!error.response) {
        console.error('❌ Network Error:', error.message);
        toast.error('Error de conexión', {
          description: 'No se pudo conectar con el servidor. Verifica tu conexión a internet.',
        });
        return Promise.reject(error);
      }

      const { data, status } = error.response;

      // ============================================
      // MANEJO DE 401 - Unauthorized (Refresh Token)
      // ============================================
      if (status === 401 && !originalRequest._retry) {
        // Verificar si es el mensaje específico de "Unauthorized"
        if (data === 'Unauthorized' || (data as any)?.message === 'Unauthorized') {
          originalRequest._retry = true;

          try {
            console.log('🔄 Refreshing token...');
            
            // Intentar refrescar el token
            await refreshClient.get('/auth/refresh');
            
            console.log('✅ Token refreshed successfully');
            
            // Reintentar la petición original
            return apiClient(originalRequest);
          } catch (refreshError) {
            console.error('❌ Refresh token failed:', refreshError);
            
            toast.error('Sesión expirada', {
              description: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
            });
            
            // Redirigir al login después de un pequeño delay
            setTimeout(() => {
              window.location.href = '/login';
            }, 1500);
            
            return Promise.reject(refreshError);
          }
        }
      }

      // ============================================
      // MANEJO DE OTROS ERRORES
      // ============================================
      handleErrorResponse(status, data);

      // Asegurar que data sea un objeto antes de hacer spread
      const errorData = typeof data === 'object' && data !== null 
        ? data 
        : { message: String(data) };

      return Promise.reject({
        ...errorData,
        status,
      });
    }
  );
}

/**
 * Maneja los diferentes códigos de error HTTP
 */
function handleErrorResponse(status: number, data: any): void {
  const message = data?.message || data?.error || 'Ocurrió un error inesperado';

  switch (status) {
    case 400:
      toast.error('Error en la solicitud', {
        description: message,
      });
      break;

    case 401:
      toast.error('No autorizado', {
        description: 'No tienes permisos para realizar esta acción.',
      });
      break;

    case 403:
      toast.error('Acceso denegado', {
        description: 'No tienes permisos para acceder a este recurso.',
      });
      break;

    case 404:
      toast.error('No encontrado', {
        description: 'El recurso solicitado no existe.',
      });
      break;

    case 409:
      toast.error('Conflicto', {
        description: message,
      });
      break;

    case 422:
      if (data?.errors && Array.isArray(data.errors)) {
        data.errors.forEach((error: any) => {
          toast.error('Error de validación', {
            description: `${error.field}: ${error.message}`,
          });
        });
      } else {
        toast.error('Error de validación', {
          description: message,
        });
      }
      break;

    case 429:
      toast.error('Demasiadas solicitudes', {
        description: 'Has excedido el límite de solicitudes. Intenta más tarde.',
      });
      break;

    case 500:
      toast.error('Error del servidor', {
        description: 'Ocurrió un error en el servidor. Por favor, intenta más tarde.',
      });
      break;

    case 502:
      toast.error('Servidor no disponible', {
        description: 'El servidor no está disponible temporalmente.',
      });
      break;

    case 503:
      toast.error('Servicio no disponible', {
        description: 'El servicio está temporalmente fuera de línea.',
      });
      break;

    default:
      if (status >= 500) {
        toast.error('Error del servidor', {
          description: message,
        });
      } else {
        toast.error('Error', {
          description: message,
        });
      }
  }

  // Log para desarrollo
  if (process.env.NODE_ENV === 'development') {
    console.error(`❌ API Error [${status}]:`, data);
  }
}

/**
 * Interceptor específico para refresh token (sin interceptors)
 */
export function setupRefreshInterceptors(refreshClient: AxiosInstance): void {
  refreshClient.interceptors.response.use(
    (response) => response,
    (error) => {
      console.error('❌ Refresh Token Error:', error);
      return Promise.reject(error);
    }
  );
}