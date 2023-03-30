import styled from '@emotion/styled'
import { ThemeProvider, createTheme } from '@mui/material'
import { useCallback, useState } from 'react'
import { ButtonsConfig, Editor } from 'ketcher-react'
import { Ketcher } from 'ketcher-core'
import { StandaloneStructServiceProvider } from 'ketcher-standalone'
import 'ketcher-react/dist/index.css'

import './App.css'
import { Panel } from './components/Panel'
import { OutputArea } from './components/OutputArea'
import { initiallyHidden } from './constants/buttons'
import { defaultTheme } from './constants/defaultTheme'

import * as React from 'react'
import { styled as mui_styled } from '@mui/material/styles'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

const GridWrapper = styled('div')`
  height: 100vh;
  width: 100vw;
  max-height: 100vh;
  max-width: 100vw;
  overflow: hidden;
  display: grid;
  grid-template-columns: 40% 1fr;
  grid-template-rows: 1fr;
  gap: 0px 0px;
  grid-template-areas: 'Panel OutputTabs';
  & > div {
    border: 1px solid grey;
  }
`

const GridTabWrapper = styled('div')`
  height: 100vh;
  width: 100%;
  max-height: 100vh;
  max-width: 100%;
  overflow: hidden;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 70px 1fr;
  gap: 0px 0px;
  grid-template-areas:
    'TabsBox'
    'TabPanelBox';
  & > div {
    border: 1px solid grey;
  }
`

const TabsBoxWrapper = styled('div')`
  grid-area: TabsBox;
  width: 100%;
  background: grey;
  & > div {
    border: 0px solid red;
  }
`

const TabPanelBoxWrapper = styled('div')`
  grid-area: TabPanelBox;
  width: 100%;
  height: 100%;
  background: red;
  & > div {
    border: 0px solid red;
  }
`

const PanelBox = styled('div')`
  grid-area: Panel;
  overflow: auto;
  padding-right: 8px;
  padding-left: 8px;
`

const OutputTabsBox = styled('div')`
  grid-area: OutputTabs;
  height: 100vh;
  width: 100%;
  bgcolor: 'gray';
`

const TabsFillBox = styled('div')`
  height: 100%;
`

interface StyledTabsProps {
  children?: React.ReactNode
  value: number
  onChange: (event: React.SyntheticEvent, newValue: number) => void
}

const StyledTabs = mui_styled((props: StyledTabsProps) => (
  <Tabs
    {...props}
    TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
  />
))({
  '& .MuiTabs-indicator': {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'transparent'
  },
  '& .MuiTabs-indicatorSpan': {
    maxWidth: 40,
    width: '100%',
    backgroundColor: '#635ee7'
  }
})

interface StyledTabProps {
  label: string
}

const StyledTab = mui_styled((props: StyledTabProps) => (
  <Tab disableRipple {...props} />
))(({ theme }) => ({
  textTransform: 'none',
  fontWeight: theme.typography.fontWeightRegular,
  fontSize: theme.typography.pxToRem(15),
  marginRight: theme.spacing(1),
  color: 'rgba(255, 255, 255, 0.7)',
  '&.Mui-selected': {
    color: '#fff'
  },
  '&.Mui-focusVisible': {
    backgroundColor: 'rgba(100, 95, 228, 0.32)'
  }
}))

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      style={{
        height: '100%',
        boxSizing: 'border-box',
        border: '1px solid red'
      }}
      {...other}
    >
      {value === index && (
        <Box
          sx={{
            p: 0,
            boxSizing: 'border-box',
            border: '10px solid blue',
            height: '95%'
          }}
        >
          <Typography sx={{ height: '100%' }}>{children}</Typography>
        </Box>
      )}
    </div>
  )
}
//          <Typography>{children}</Typography>

const theme = createTheme(defaultTheme)

const getHiddenButtonsConfig = (btnArr: string[]): ButtonsConfig => {
  return btnArr.reduce((acc, button) => {
    if (button) acc[button] = { hidden: true }

    return acc
  }, {})
}

const structServiceProvider = new StandaloneStructServiceProvider()

const getUniqueKey = (() => {
  let count = 0
  return () => {
    count += 1
    return `editor-key-${count}`
  }
})()

export default function CustomizedTabs() {
  const [outputValue, setOutputValue] = useState('')
  const [hiddenButtons, setHiddenButtons] = useState(initiallyHidden)
  const [editorKey, setEditorKey] = useState('first-editor-key')

  const updateHiddenButtons = useCallback(
    (buttonsToHide: string[]) => {
      setHiddenButtons(buttonsToHide)
      setEditorKey(getUniqueKey())
    },
    [setHiddenButtons, setEditorKey]
  )

  const [value, setValue] = React.useState(0)

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  return (
    <ThemeProvider theme={theme}>
      <GridWrapper>
        <PanelBox>
          <h1> Instructions </h1>
          <p> Directions go here. </p>
        </PanelBox>
        <GridTabWrapper>
          <TabsBoxWrapper>
            <StyledTabs
              value={value}
              onChange={handleChange}
              aria-label="styled tabs example"
            >
              <StyledTab label="Workflows" />
              <StyledTab label="Datasets" />
              <StyledTab label="Connections" />
            </StyledTabs>
          </TabsBoxWrapper>
          <TabPanelBoxWrapper>
            <TabPanel value={value} index={0}>
              <Editor
                key={editorKey}
                staticResourcesUrl={process.env.PUBLIC_URL}
                buttons={getHiddenButtonsConfig(hiddenButtons)}
                structServiceProvider={structServiceProvider}
                errorHandler={(err) => console.log(err)}
                onInit={(ketcher: Ketcher) => {
                  ;(global as any).ketcher = ketcher
                  ;(global as any).KetcherFunctions = KetcherAPI(global.ketcher)
                  global.ketcher.setMolecule('CN=C=O')
                }}
              />
            </TabPanel>

            <TabPanel value={value} index={1}>
              <Panel
                printToTerminal={setOutputValue}
                hiddenButtons={hiddenButtons}
                buttonsHideHandler={updateHiddenButtons}
              />
            </TabPanel>
            <TabPanel value={value} index={2}>
              <div
                style={{
                  height: '100%',
                  boxSizing: 'border-box',
                  border: '5px solid green'
                }}
              >
                <OutputArea
                  outputValue={outputValue}
                  setOutputValue={setOutputValue}
                />
              </div>
            </TabPanel>
          </TabPanelBoxWrapper>
        </GridTabWrapper>
      </GridWrapper>
    </ThemeProvider>
  )
}

//GridTabWrapper
/*
                <Editor
                  key={editorKey}
                  staticResourcesUrl={process.env.PUBLIC_URL}
                  buttons={getHiddenButtonsConfig(hiddenButtons)}
                  structServiceProvider={structServiceProvider}
                  errorHandler={(err) => console.log(err)}
                  onInit={(ketcher: Ketcher) => {
                    ;(global as any).ketcher = ketcher
                    ;(global as any).KetcherFunctions = KetcherAPI(
                      global.ketcher
                    )
                    global.ketcher.setMolecule('CN=C=O')
                  }}
                />
*/

//    <Box sx={{ width: '100%', height: '100vh', bgcolor: 'gray' }}>
