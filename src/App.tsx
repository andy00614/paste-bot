/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { ipcRenderer } from 'electron';
import React, {
  BaseSyntheticEvent,
  SyntheticEvent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
// import useIpcRender from './hooks/useIpcRender';
import './App.global.scss';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import { debounce } from 'lodash-es';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import TextService from './db/text_service';
import { TextTableType } from './db/var';
import styles from './app.scss';

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const Hello = () => {
  const [textList, setTextList] = useState<TextTableType[]>([]);
  useEffect(() => {
    const textService = new TextService();
    const getListThenSet = async () => {
      const list = await textService.getTexts();
      setTextList(list);
    };
    ipcRenderer.on('set-clipboard', async (_, text: string) => {
      await textService.addText({
        text,
        date: new Date(),
      });
      getListThenSet();
    });
    getListThenSet();
  }, []);
  // useIpcRender();
  const textOnchang = useCallback(
    debounce(async (e: { target: { value: string } }) => {
      const textService = new TextService();
      const { value } = e.target;
      const searchedText = await textService.getTextByWord(value);
      setTextList(searchedText);
    }, 200),
    []
  );

  const handleOnKeyPress = (e) => {
    console.log(e);
  };

  const [open, setOpen] = React.useState(false);
  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const handleClickItem = (item: TextTableType) => {
    console.log(item);
    ipcRenderer.send('set-paste', item);
    handleClick();
  };
  return (
    <>
      <Grid container>
        <Grid item xs={12}>
          <TextField
            onChange={textOnchang}
            id="standard-search"
            label="Search field"
            type="search"
            classes={{
              root: styles.input,
            }}
          />
        </Grid>
        <div className={styles.content}>
          <Grid item xs={6}>
            <Snackbar
              anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
              open={open}
              autoHideDuration={1000}
              onClose={handleClose}
            >
              <Alert onClose={handleClose} severity="success">
                复制成功
              </Alert>
            </Snackbar>
            <ul>
              {textList.map((item) => {
                return (
                  <li
                    onClick={() => handleClickItem(item)}
                    onKeyPress={handleOnKeyPress}
                    key={item.id}
                  >
                    {item.text}
                  </li>
                );
              })}
            </ul>
          </Grid>
          <Grid item xs={6}>
            <div>preview</div>
          </Grid>
        </div>
      </Grid>
    </>
  );
};

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" component={Hello} />
      </Switch>
    </Router>
  );
}
