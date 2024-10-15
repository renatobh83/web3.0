import {
  Box,
  Card,
  CardContent,
  Tab,
  Tabs,
  Typography,
} from '@mui/material'
import type { Node } from '@xyflow/react'
import { a11yProps, TabPanel } from '../MaterialUi/TablePanel'
import { useState } from 'react'
import { TabConfiguracao } from './TabConfiguracao'
import { Interacoes } from './FlowInteracoes'
import { Condicoes } from './FlowCondicoes'

export const TabsDetails = ({
  node,
  atualizarNode,
}: { node: Node | undefined; atualizarNode: (arg0: Node) => void }) => {


  const nodeType = node?.type
  const [tabSelected, setTabSelected] = useState(0)

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const handleChangeTabs = (newValue: any) => {
    setTabSelected(newValue)
  }

  return (
    <>
      {nodeType === 'configuracao' ? (
        <TabConfiguracao node={node} />

      ) : nodeType === 'start' ? (
        <Box
          sx={{
            height: 'calc(100vh - 300px)',
            mx: 1,
            transition: 'background-color 0.3s ease-in-out',
            overflow: 'auto',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          <Card sx={{ width: '100%' }}>
            <CardContent>
              <Typography gutterBottom variant="h6" component="span">
                Etapa representa o contato inicial.
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                - Caso seja o primeiro contato do cliente, o sistema salvará
                automaticamente na agenda as informações do cliente. - O Bot irá
                interagir nos atendimentos iniciados pelos clientes. - O Bot irá
                parar de interagir caso o atendimento seja assumido por um
                usuário.
              </Typography>
            </CardContent>
          </Card>
        </Box>
      ) : (
        <>
          <Tabs
            sx={{ mt: 2, minHeight: 60 }}
            variant="fullWidth"
            value={tabSelected}
            onChange={(_event, newValue) => handleChangeTabs(newValue)}
          >
            <Tab label={'interações'} {...a11yProps(0, 'interacoes')} />
            <Tab label={'Condições'} {...a11yProps(1, 'condicoes')} />
          </Tabs>
          <TabPanel value={tabSelected} index={0}>
            <Interacoes node={node} />
          </TabPanel>
          <TabPanel value={tabSelected} index={1}>
            <Condicoes node={node} />
          </TabPanel>
        </>
      )}
    </>
  )
}
