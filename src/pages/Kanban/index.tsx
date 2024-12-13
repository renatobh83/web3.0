
import { Tabs, Tab, Toolbar } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { Outlet, useNavigate } from 'react-router-dom';


export const Kanban = () => {
     const { decryptData } = useAuth()
  const profile = decryptData('profile') as unknown as String
  
  const navigate = useNavigate()

 

  const handleTabChange = (event, newValue) => {
    navigate(newValue);
  };

  return (
    profile === 'admin' && (
      <>
        
        <Tabs
          value={false}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          textColor="primary"
          indicatorColor="primary"
          aria-label="Kanban Tabs"
        >
          <Tab
            label="Kanban"
            icon={<i className="mdi mdi-developer-board" />}
            value="/kanban/kanbans"
          />
          <Tab
            label="Etiqueta"
            icon={<i className="mdi mdi-tag-text" />}
            value="/kanban/tags"
          />
        </Tabs>
        <Outlet/>
      </>
    )
  );
};



