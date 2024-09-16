import { create } from "zustand";

interface Contact {
  id: number;
  name: string;
  // Outros campos que os contatos possam ter
}

interface ContactsState {
  contatos: Contact[];
  loadContacts: (contacts: Contact[]) => void;
  updateContact: (contact: Contact) => void;
  deleteContact: (contactId: number) => void;
  resetContacts: () => void;
}
export const useContatosStore = create<ContactsState>((set) => ({
  contatos: [],

  // Ação para carregar múltiplos contatos
  loadContacts: (contacts) =>
    set((state) => {
      const newContacts = [];

      contacts.forEach((contact) => {
        const contactIndex = state.contatos.findIndex(
          (c) => c.id === contact.id
        );
        if (contactIndex !== -1) {
          state.contatos[contactIndex] = contact;
        } else {
          newContacts.push(contact);
        }
      });

      return { contatos: [...state.contatos, ...newContacts] };
    }),

  // Ação para atualizar ou adicionar um contato
  updateContact: (contact) =>
    set((state) => {
      const contactIndex = state.contatos.findIndex((c) => c.id === contact.id);
      if (contactIndex !== -1) {
        state.contatos[contactIndex] = contact;
        return { contatos: [...state.contatos] };
      } else {
        return { contatos: [contact, ...state.contatos] };
      }
    }),

  // Ação para deletar um contato
  deleteContact: (contactId) =>
    set((state) => {
      const contactIndex = state.contatos.findIndex((c) => c.id === contactId);
      if (contactIndex !== -1) {
        const updatedContatos = [...state.contatos];
        updatedContatos.splice(contactIndex, 1);
        return { contatos: updatedContatos };
      }
      return { contatos: state.contatos };
    }),

  // Ação para resetar a lista de contatos
  resetContacts: () =>
    set(() => ({
      contatos: [],
    })),
}));
