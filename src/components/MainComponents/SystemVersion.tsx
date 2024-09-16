import type React from 'react';
import packageJson from '../../../package.json';
import { Box, Typography } from '@mui/material';

const SystemVersion: React.FC = () => {
    const cVersion = packageJson.version;

    return (
        <Box sx={{ textAlign: 'center' }}>
            <Typography> Versão Sistema: </Typography>
            <Typography variant="subtitle2" gutterBottom> V {cVersion} </Typography>

        </Box>
    );
};

export default SystemVersion;