import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Snackbar,
} from '@mui/material';
import DragDropContext, { Draggable, Droppable } from 'react-beautiful-dnd';


export const Kanbans = () => {

  const [dropGroups, setDropGroups] = useState([]);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', type: '' });

//   const loadKanbans = async () => {
//     try {
//       const kanbans = await fetchKanbans();
//       setDropGroups(kanbans.map(k => ({ id: k.id, name: k.name, children: [] })));
//     } catch (error) {
//       console.error('Error fetching kanbans:', error);
//     }
//   };

//   const loadContacts = async () => {
//     setLoading(true);
//     try {
//       const contacts = await fetchContacts();
//       // Process and assign contacts to kanban groups
//       const updatedGroups = [...dropGroups];
//       contacts.forEach(contact => {
//         const group = updatedGroups.find(g => g.id === contact.kanban);
//         if (group) {
//           group.children.push(contact);
//         }
//       });
//       setDropGroups(updatedGroups);
//     } catch (error) {
//       console.error('Error fetching contacts:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

  const handleSave = async (updatedData) => {
    setSnackbar({ open: true, message: 'Saving data...', type: 'info' });
    try {
    //   await Promise.all(
    //     updatedData.map(contact => updateContact(contact.id, contact))
    //   );
      setSnackbar({ open: true, message: 'Data saved successfully!', type: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Error saving data.', type: 'error' });
    }
  };

  const handleOpenDialog = (contact) => {
    setSelectedContact(contact);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedContact(null);
  };

  const handleCreateTicket = async (channelId) => {
    try {
    //   await createTicket(selectedContact.id, channelId);
      setSnackbar({ open: true, message: 'Ticket created successfully!', type: 'success' });
    } catch (error) {
      console.error('Error creating ticket:', error);
      setSnackbar({ open: true, message: 'Error creating ticket.', type: 'error' });
    } finally {
      handleCloseDialog();
    }
  };

  useEffect(() => {
    // loadKanbans();
    // loadContacts();
  }, []);

  return (
    <div style={{ padding: '16px' }}>
      <Card style={{ marginBottom: '16px' }}>
        <CardContent>
          <Typography variant="h6" component="div">
            Controle Visual de Atendimentos
          </Typography>
        </CardContent>
      </Card>

      {loading && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CircularProgress />
        </div>
      )}

      {!loading && (
        <DragDropContext onDragEnd={(result) => handleSave(result)}>
          {dropGroups.map(group => (
            <Droppable key={group.id} droppableId={group.id.toString()}>
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  <Typography variant="h6">{group.name}</Typography>
                  {group.children.map((card, index) => (
                    <Draggable key={card.id} draggableId={card.id.toString()} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          {/* <Cards
                            data={card}
                            onOpenDialog={() => handleOpenDialog(card)}
                          /> */}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </DragDropContext>
      )}

      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Iniciar Atendimento</DialogTitle>
        <DialogContent>
          <Typography>Selecione o canal para o atendimento de {selectedContact?.title}.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleCreateTicket('whatsapp')} color="primary">
            WhatsApp
          </Button>
          <Button onClick={() => handleCreateTicket('waba')} color="secondary">
            WABA
          </Button>
          <Button onClick={() => handleCreateTicket('baileys')} color="error">
            Baileys
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
      />
    </div>
  );
};
