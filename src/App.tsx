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
import { IpcEventName } from './var';
import { ImgInfo } from './type';
import arrayBufferToBase64 from './utils/image';

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

    ipcRenderer.on(IpcEventName.setText, async (_, text: string) => {
      if (text) {
        await textService.addText({
          date: new Date(),
          type: 'text',
          text,
        });
        getListThenSet();
      }
    });

    ipcRenderer.on(IpcEventName.setImg, async (_, imgInfo: ImgInfo) => {
      if (imgInfo.buffer.length > 0) {
        const data = await textService.addText({
          date: new Date(),
          type: 'image',
          buffer: imgInfo.buffer,
          text: imgInfo.name,
        });
        getListThenSet();
      }
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
          {/* <Grid item xs={6}> */}
          <Snackbar
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            open={open}
            autoHideDuration={1000}
            onClose={handleClose}
          >
            <Alert onClose={handleClose} severity="success">
              ????????????
            </Alert>
          </Snackbar>
          <ul>
            {textList.map((item) => {
              return (
                <li
                  onClick={() => handleClickItem(item)}
                  onKeyPress={handleOnKeyPress}
                  key={item.id}
                  className={styles.pasteItem}
                >
                  {item.type === 'text' ? (
                    <span>{item.text}</span>
                  ) : (
                    <img
                      className={styles.pasteImage}
                      src={arrayBufferToBase64(item.buffer as Buffer)}
                      alt="tupian"
                    />
                  )}
                </li>
              );
            })}
          </ul>
          {/* </Grid> */}
          {/* <Grid item xs={6}>
            <div>preview</div>
          </Grid> */}
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
