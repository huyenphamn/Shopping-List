"use client"

import { Box, TextField, Typography } from '@mui/material'
import { Stack } from '@mui/material'
import { Button } from '@mui/material'
import { Modal } from '@mui/material'
import { collection,doc, getDocs, query, setDoc, deleteDoc, getDoc,} from 'firebase/firestore';
import { firestore } from '../../../firebase';
import { useEffect, useState } from 'react';
import Alert from '@mui/material/Alert';
import styles from "./ShoppingList.module.css";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'white',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
};

export const ShoppingList = () =>{

  const [pantry, setPantry] = useState([])

  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const [itemName, setItemName] = useState('')
  const updatePantry = async () => {
    const snapshot = query(collection(firestore, 'pantry'))
    const pantryList = []
    const docs = await getDocs(snapshot)
    docs.forEach((doc) => {
      pantryList.push({name: doc.id, ...doc.data()})
    })
    console.log(pantryList)
    setPantry(pantryList)
  }
  useEffect(() => {
    
    updatePantry()
  }, [])

  const addItem = async (item) => {
    const docRef = doc(collection(firestore,'pantry'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()){
      const {count} = docSnap.data()
      await setDoc(docRef, {count: count + 1})
    }
    else{
    await setDoc(docRef, {count: 1})}
    await updatePantry()
  }

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore,'pantry'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()){
      const {count} = docSnap.data()
      if (count == 1){
        await deleteDoc(docRef)
      }
      else{
      await setDoc(docRef, {count: count - 1})}
    }
    await updatePantry()
    
  }
  
  return (
    <section className={styles.container} id="shopping">
        <h1 className={styles.title}>My Shopping List</h1>
        
   
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className={styles.addItem}
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Item
          </Typography>
          <Stack width="100%" direction={"row"} spacing={3}>
            <TextField id="outlined_basic" label="Item" variant="outlined" fullWidth value={itemName} onChange={(e) => setItemName(e.target.value)}/>
            <Button variant='outlined' onClick={() => {
              addItem(itemName)
              setItemName('')
              handleClose()
            }}>
              Add
            </Button>
          </Stack>

        </Box>
      </Modal>
      <Button variant="contained" onClick={handleOpen}>Add</Button>
      <Box border={'1px solid #333'} >
        <Box
          width="800px"
          height="100px"
          display={"flex"}
          justifyContent={'center'}
          alignItems={'center'}
          bgcolor={'#ADD8E6'}
          className={styles.pantryList}
        >
          <Typography
            variant={'h2'}
            color={'#333'}
            textAlign={'center'}>
            Pantry Items
          </Typography>
        </Box>
        <Stack width="800px" height="300px" spacing={2} overflow={'auto'} className={styles.pantryItems}>
          {pantry.map(({name, count}) => (
            
            <Box
              key={name}
              width="100%"
              minHeight="150px"
              display={"flex"}
              justifyContent={'space-between'}
              alignItems={'center'}
              bgcolor={'#f0f0f0'}
              paddingX={5}
            >

              <Typography
                variant={'h2'}
                color={'#333'}
                textAlign={'center'}
                className={styles.item}
              >
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>

              <Typography
                variant={'h2'}
                color={'#333'}
                textAlign={'center'}
                className={styles.quantity}
              >
                Quantity: {count}
              </Typography>
            
            <Button variant='contained' onClick={()=>removeItem(name)}>
              Remove
            </Button>
            
            </Box>
            
          )
          )}
        </Stack>
      </Box>
    
    </section>
  );
}