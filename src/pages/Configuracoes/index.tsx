import { Settings } from '@mui/icons-material'
import { Box, Checkbox, List, ListItem, Tab, Tabs, Toolbar, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  }
}
export const Configuracoes = () => {
  const { decryptData } = useAuth()
  const [value, setValue] = React.useState(0)

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }
  const confi  = JSON.parse(localStorage.getItem("configuracoes"))
  const [configuracoesOpcoes, setConfiguracoesOpcoes] = useState([])

  const usuario =  JSON.parse(decryptData('usuario'))
  useEffect(()=>{
    if(confi) {
      setConfiguracoesOpcoes(confi)
      console.log(confi, usuario.tenantId)
    }
  },[setConfiguracoesOpcoes])
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [checked, setChecked] = useState<{
    [key: string] : {
        checked: boolean
    }
  }>({});

  const handleChangeCheck = (event: React.ChangeEvent<HTMLInputElement>, key: string) => {
    const value = event.target.checked
    console.log(value)
    setChecked(prevState => ({
      ...prevState,
      [key]: { checked: value },
    }))
  };
  const handleListItemClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number,
  ) => {
    if(index === selectedIndex) return
    setSelectedIndex(index);
    console.log(checked)
  };

  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' }, pt: 2 }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Configuracoes Gerais" {...a11yProps(0)} icon={<Settings/>} /> 
          {/* <Tab label="Item Two" {...a11yProps(1)} />
          <Tab label="Item Three" {...a11yProps(2)} /> */}
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        {/* <Box  sx={{display: "flex", flexDirection: 'column', justifyContent: "space-between"}}> */}
        {configuracoesOpcoes
       .filter(id => id.tenantId === usuario.tenantId)
        .map(item => (
          <List key={item.id} component="nav" aria-label="main mailbox folders" 
         >
            <ListItem 
             sx={{display: "flex", flexDirection: 'row', justifyContent: "space-between", width: '100%'}}
            onClick={(event) => handleListItemClick(event, item.id)}
            >
              <Typography variant='body2'>Desc</Typography> 
            <Box>
              {(item.value === "disabled" || item.value === "enabled") ? (
          <Checkbox 
            checked={checked[item.id]?.checked || false}  // Usa o estado para controlar o checkbox
            onChange={e => handleChangeCheck(e, item.id)}
            inputProps={{ 'aria-label': 'controlled' }}
          />
        ) : (
          <Typography variant='body2'>{item.value}</Typography>  // Mostra o valor quando não for 'disabled' ou 'enabled'
        )}
        </Box>
            </ListItem>
            </List>
        ))}
        {/* </Box> */}
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        Item Two
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        Item Three
      </CustomTabPanel>
    </Box>
  )
}
