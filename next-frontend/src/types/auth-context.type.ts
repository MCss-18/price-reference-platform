import { User } from "./user.type";

export interface AuthContextValue {
  user?: User; 
  error: unknown;
  isLoading: boolean;
  isFetching: boolean;
  refetch: () => void;
}


