import React from 'react';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  Tooltip,
  Avatar,
  Grid,
} from '@mui/material';
import TagIcon from '@mui/icons-material/LocalOffer';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import CancelIcon from '@mui/icons-material/Cancel';

interface Tag {
  tag: string;
  color: string;
}

interface CardData {
  profilePicUrl?: string;
  tags: Tag[];
  wallet?: string;
  title: string;
  description: string;
  id: number;
}

interface Props {
  data: CardData;
  whatsapps: { type: string; isDeleted: boolean; status: string }[];
  onOpenTicket: (data: CardData) => void;
  onMarkDone: (data: CardData) => void;
}

export const CustomCard: React.FC<Props> = ({ data, whatsapps, onOpenTicket, onMarkDone }) => {
  const cSessionsWpp = whatsapps.filter(
    (w) => ['whatsapp'].includes(w.type) && !w.isDeleted && w.status === 'CONNECTED'
  );

  const cSessionsBaileys = whatsapps.filter(
    (w) => ['baileys'].includes(w.type) && !w.isDeleted && w.status === 'CONNECTED'
  );

  const cSessionsWaba = whatsapps.filter(
    (w) => ['waba'].includes(w.type) && !w.isDeleted && w.status === 'CONNECTED'
  );

  const getPhoneNumberLink = (number: string) => {
    if (number.startsWith('55') && parseInt(number.charAt(4), 10) > 5) {
      return `tel:${number.slice(0, 4)}9${number.slice(4)}`;
    }
    return `tel:${number}`;
  };

  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        padding: 2,
        margin: 2,
        width: 280,
        boxShadow: 3,
        borderRadius: 2,
        ':hover': { boxShadow: 6 },
      }}
    >
      <CardContent sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginRight: 2 }}>
          {data.profilePicUrl && (
            <Avatar
              src={data.profilePicUrl}
              alt="Profile"
              sx={{ width: 80, height: 80, marginBottom: 1 }}
            />
          )}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'start', gap: 1 }}>
            {data.tags.map((tag) => (
              <Tooltip title={tag.tag} key={tag.tag}>
                <TagIcon style={{ color: tag.color, fontSize: '1.4em' }} />
              </Tooltip>
            ))}
            {data.wallet && (
              <Tooltip title={data.wallet}>
                <WhatsAppIcon style={{ fontSize: '1.4em' }} />
              </Tooltip>
            )}
          </Box>
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" sx={{ marginBottom: 1 }}>
            {data.title}
          </Typography>
          <Typography
            variant="body2"
            color="textSecondary"
            sx={{ marginBottom: 1, filter: 'blur(0px)' }}
            component="a"
            href={getPhoneNumberLink(data.description)}
          >
            {data.description}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            {'#' + data.id}
          </Typography>
        </Box>
      </CardContent>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'start',
          gap: 1,
          marginTop: 2,
        }}
      >
        {cSessionsWpp.length > 0 && (
          <Tooltip title="Atendimento WWebJs">
            <IconButton
              onClick={() => onOpenTicket(data)}
              color="success"
              size="small"
            >
              <WhatsAppIcon />
            </IconButton>
          </Tooltip>
        )}
        {cSessionsBaileys.length > 0 && (
          <Tooltip title="Atendimento Baileys">
            <IconButton
              onClick={() => onOpenTicket(data)}
              color="success"
              size="small"
            >
              <WhatsAppIcon />
            </IconButton>
          </Tooltip>
        )}
        {cSessionsWaba.length > 0 && (
          <Tooltip title="Atendimento Waba">
            <IconButton
              onClick={() => onOpenTicket(data)}
              color="success"
              size="small"
            >
              <WhatsAppIcon />
            </IconButton>
          </Tooltip>
        )}
        <Tooltip title="Remover">
          <IconButton
            onClick={() => onMarkDone(data)}
            color="error"
            size="small"
          >
            <CancelIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Card>
  );
};

