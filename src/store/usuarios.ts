import { create } from "zustand";

interface Usuario {
  userId?: string;
  username?: string;
  tenantId?: string | null;
  email: string;
  profile: string;
  queues?: [];
  name?: string;
  id?: number;
}

interface UsuarioStore {
  usuarios: Usuario[];
  usuarioSelecionado: Usuario | null;
  modalUsuario: boolean;
  modalFilaUsuario: boolean;

  setUsuarioSelecionado: (usuario: Usuario) => void;
  criarUsuario: (usuario: Usuario) => void;
  editarUsuario: (usuario: Usuario) => void;
  deletarUsuario: (userId: number) => void;
  toggleModalUsuario: () => void;
  toggleModalFilaUsuario: () => void;
  loadUsuarios: (usuarios: []) => void;
  insertNewUser: (usuario: Usuario) => void;
}

export const useUsuarioStore = create<UsuarioStore>((set) => ({
  usuarios: [],
  usuarioSelecionado: null,
  modalUsuario: false,
  modalFilaUsuario: false,
  loadUsuarios: (usuarios) => set({ usuarios: usuarios }),
  insertNewUser: (user: Usuario) =>
    set((state) => ({
      usuarios: [...state.usuarios, user],
    })),
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
  deletarUsuario: (userId) => {
    set((state) => ({
      usuarios: state.usuarios.filter((u) => Number(u.userId) !== userId),
    }));
  },
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
