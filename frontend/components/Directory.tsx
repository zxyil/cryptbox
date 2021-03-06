import React, { useRef } from 'react';
import { useRouter } from 'next/router';

import FolderIcon from '@material-ui/icons/Folder';
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf';
import ImageIcon from '@material-ui/icons/Image';
import DescriptionIcon from '@material-ui/icons/Description';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import DeleteIcon from '@material-ui/icons/Delete';
import styles from '../styles/Directory.module.css';
import { IconButton } from '@material-ui/core';

import { deletereq } from '../pages/request-utils'

const mappedIcon = {
    'folder': <FolderIcon />,
    'pdf': <PictureAsPdfIcon />,
    'png': <ImageIcon />,
    'jpg': <ImageIcon />,
    'jpeg': <ImageIcon />,
    'txt': <DescriptionIcon />,
};

interface DirectoryProps {
    data: Object,
    chooseFile: Function,
    changeDirectory: Function,
    isFirst: boolean,
    isLast: boolean
    update: Function;
}

function cont(value, dict) {
    for(let [key, val] of Object.entries(dict)) {
        if(value != key) continue;
        return true;
    }
    return false;
}


export default function Directory({data, chooseFile, changeDirectory, isFirst, isLast, update}: DirectoryProps){
    const router = useRouter();

    function selectFile() {
        if(data['extension'] == 'folder'){
            console.log("CLICKED");
            changeDirectory({ 'name': data['name'], 'id': data['id'] });
        }else{
            console.log("CLICKED FILE");
            chooseFile(data);
        }
    }

    function deleteEntry(){
      if(data['extension'] == 'folder') {
        deletereq("/directory/" + data['id'], {}, ()=>{
          update();
        });
      }
      else {
        deletereq("/file/"+data['id'], {}, ()=>{
          update();
        });
      }
    }

    if(isFirst){
        return(
            <div className = { styles.fileEntryContainerNoHover } style = {{ borderTop: 0, borderBottom: isLast?'1px solid #00000033':'' }}>
                <h1 className = { styles.fileEntryComponent } style = {{ fontFamily: 'var(--bold-font)', paddingLeft: '0.5%', width: '40%' }}> File Name </h1>

                <h1 className = { styles.fileEntryComponentRight } style = {{ fontFamily: 'var(--bold-font)', width: '10%', right:"3%" }}> Date Uploaded </h1>
                <h1 className = { styles.fileEntryComponentRight } style = {{ fontFamily: 'var(--bold-font)', width: '10%', right:"2.7%" }}> Last Modified </h1>
                <h1 className = { styles.fileEntryComponentRight } style = {{ fontFamily: 'var(--bold-font)', width: '6%', right:"2.5%" }}> Extension </h1>
            </div>
        )
    }

    let typeIcon = cont(data['extension'], mappedIcon)?mappedIcon[data['extension']]:<AttachFileIcon />;

     return(
        <div className = { styles.fileEntryContainerNoHover } style = {{borderBottom: isLast?'1px solid #00000033':'' }} >
            <IconButton className={styles.deleteEntry} disableRipple={true} disableFocusRipple={true} disableTouchRipple={true} onClick={()=>{
                deleteEntry()
            }}>
                <DeleteIcon />
            </IconButton>
            <div className={styles.fileEntryContainer} onClick = { selectFile } >
                <div className = { styles.fileEntryIcon } style = {{ width: '2%' }}> { typeIcon } </div>
                <h1 className = { styles.fileEntryComponent } style = {{ width: '40%' }}> { data['name'] } </h1>

                <h1 className = { styles.fileEntryComponentRight } style = {{ width: '10%' }}> { data['created'] } </h1>
                <h1 className = { styles.fileEntryComponentRight } style = {{ width: '10%' }}> { data['modified'] } </h1>
                <h1 className = { styles.fileEntryComponentRight } style = {{ width: '6%' }}> { data['extension'] } </h1>
            </div>
        </div>
    )
}
