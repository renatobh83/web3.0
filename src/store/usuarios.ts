import { create } from "zustand";

interface Usuario {
  userId?: string;
  username: string;
  tenantId: string;
  email: string;
  profile: string;
  queues?: any;
  name?: string;
}

interface UsuarioStore {
  usuarios: Usuario[];
  usuarioSelecionado: Usuario | null;
  modalUsuario: boolean;
  modalFilaUsuario: boolean;

  setUsuarioSelecionado: (usuario: Usuario) => void;
  criarUsuario: (usuario: Usuario) => void;
  editarUsuario: (usuario: Usuario) => void;
  deletarUsuario: (usuario: Usuario) => void;
  toggleModalUsuario: () => void;
  toggleModalFilaUsuario: () => void;
  loadUsuarios: (usuarios: []) => void;
}

export const useUsuarioStore = create<UsuarioStore>((set) => ({
  usuarios: [],
  usuarioSelecionado: null,
  modalUsuario: false,
  modalFilaUsuario: false,
  loadUsuarios: (usuarios) => set({ usuarios: usuarios }),

  setUsuarioSelecionado: (usuario) => set({ usuarioSelecionado: usuario }),

  criarUsuario: (usuario) =>
    set((state) => ({
      usuarios: [...state.usuarios, { ...usuario }],
    })),

  editarUsuario: (usuario) =>
    set((state) => {
      let newUsuarios = state.usuarios;
      const usuarioIndex = newUsuarios.findIndex((c) => c.id === usuario.id);
      if (usuarioIndex !== -1) {
        newUsuarios[usuarioIndex] = usuario;
      } else {
        newUsuarios = [usuario, ...newUsuarios];
      }
      return { usuarios: newUsuarios };
    }),
  deletarUsuario: (usuario) =>
    set((state) => ({
      usuarios: state.usuarios.filter((u) => u.userId !== usuario.userId),
    })),
  toggleModalUsuario: () =>
    set((state) => {
      const newState = !state.modalUsuario;
      return {
        modalUsuario: newState,
        usuarioSelecionado: newState ? state.usuarioSelecionado : null,
      };
    }),

  toggleModalFilaUsuario: () =>
    set((state) => {
      const newState = !state.modalFilaUsuario;
      console.log(
        "Toggling modal. New state:",
        newState,
        "Setting usuarioSelecionado to:",
        newState ? state.usuarioSelecionado : null
      );
      return {
        modalFilaUsuario: newState,
        usuarioSelecionado: newState ? state.usuarioSelecionado : null,
      };
    }),
}));
