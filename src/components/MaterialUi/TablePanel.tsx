interface TabPanelProps {
    children?: React.ReactNode
    index: number
    value: number
}

export function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            style={{
                // height: 'calc(100% - 180px)',
                // overflow: 'auto',
                // maxWidth: 370,
                // width: '100%',
            }}
            {...other}
        >
            {value === index && <div style={{ overflow: 'auto' }}> {children}</div>}
        </div>
    )
}
export function a11yProps(index: number, name: string) {
    return {
        id: `vertical-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`,
        name: name,
    }
}