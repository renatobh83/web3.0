import { toast } from "sonner";
import backendErrors from "../services/erros";

export function Errors(err) {
  const errorMsg = err?.data?.error;
  let error = "Ocorreu um erro não identificado.";
  if (errorMsg) {
    if (backendErrors[errorMsg]) {
      error = backendErrors[errorMsg];
    } else {
      error = err.response.data.error;
    }
  }
  toast.error(error, {
    position: "top-center",
  });
}
