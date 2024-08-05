'use client'
import Image from "next/image";
import { useState, useEffect, use } from 'react'
import { firestore } from "@/firebase"
import { Box, Typography, Modal, Stack, TextField, Button, Grid } from '@mui/material'
import { collection, doc, getDocs, query, deleteDoc, getDoc, setDoc } from "firebase/firestore";

export default function Home() {
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')
  const [searchInput, setSearchInput] = useState('');
  const [filteredItems, setFilteredItems] = useState();

  const updateInventory = async () => {
    // creates a query object
    const snapshot = query(collection(firestore, 'inventory'))
    // executes the query and saves in docs
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        // copies key:value from doc obj
        ...doc.data(),
      })
    })
    setInventory(inventoryList)
  }

  const addItem = async (item) => {
    // get direct item reference
    const docRef = doc(collection(firestore, 'inventory'), item.toLowerCase())
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      await setDoc(docRef, { quantity: quantity + 1 })
    }
    else {
      await setDoc(docRef, { quantity: 1 })
    }

    await updateInventory()
  }

  const removeItem = async (item) => {
    // get direct item reference
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      if (quantity === 1) {
        await deleteDoc(docRef)
      }
      else {
        await setDoc(docRef, { quantity: quantity - 1 })
      }
    }

    await updateInventory()
  }

  const updateSearch = async () => {
    return (inventory.filter((obj) => {
      return obj.name.toLowerCase() === searchInput.toLowerCase()
    }))
  }

  // add image

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)


  useEffect(() => {
    const filterItems = async () => {
      await updateInventory()
      const filtered = inventory.filter(item =>
        item.name.toLowerCase().includes(searchInput.toLowerCase())
      );
      await setFilteredItems(filtered);
    }
    filterItems()
  }, [searchInput])
  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"

      justifyContent="center"
      alignItems="center"
      gap={2}
    >
      <Modal open={open} onClose={() => { handleClose() }}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width={400}
          bgcolor="white"
          border="2px solid #000"
          boxShadow={24}
          p={4}
          display="flex"
          gap={3}
          sx={{
            transform: "translate(-50%, -50%)"
          }}
        >
          <Typography variant="h6">Add item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => {
                setItemName(e.target.value)
              }}
            />
            <Button variant="outlined" onClick={() => {
              // add item to database
              addItem(itemName)
              setItemName('')
              handleClose()
            }}> Add </Button>
          </Stack>

        </Box>
      </Modal>
      <Grid item xs={3} display="flex" alignItems="center" justifyContent="center" flexDirection="column" gap={2}>
        <Box border="1px solid #333">
          <Box width="800px" height="100px" bgcolor="#ADD8E6" alignItems="center" justifyContent="center" display="flex">
            <Typography variant="h2" color="#333"> Inventory Items </Typography>
          </Box>
          <Box key="header" width="100%" display="flex" alignItems="center" justifyContent="space-between" bgcolor="#ADD8E6" padding={5} paddingY={2}>
            <Typography variant='h4' color="#333" textAlign="center" >Item</Typography>
            <Typography variant='h4' color="#333" textAlign="center" >Count</Typography>
            <Typography variant='h4' color="#333" textAlign="center" >Edit</Typography>
          </Box>
          {/* Search */}
          <Box >
            <TextField
              variant="outlined"
              fullWidth
              placeholder="Search items..."
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value)
              }} />
          </Box>
          {/* Table */}
          <Stack width="800px" height="300px" spacing={2} overflow="auto">
            {(!Array.isArray(filteredItems) || !filteredItems.length ? inventory : filteredItems).map(({ name, quantity }) => (
              <Box key={name} width="100%" minHeight="100px" display="flex" alignItems="center" justifyContent="space-between" bgcolor="#f0f0f0" padding={5} paddingY={2}>
                <Typography variant='h4' color="#333" textAlign="left" flexGrow={1} flexBasis={0} >{name.charAt(0).toUpperCase() + name.slice(1)}</Typography>
                <Typography variant='h4' color="#333" textAlign="center" flexGrow={1} flexBasis={0} >{quantity}</Typography>
                <Stack direction="column" spacing={1} flexGrow={1} flexBasis={0} display='flex' alignItems='flex-end'>
                  <Button variant="contained" onClick={() => { addItem(name) }} size="small" sx={{ width: '100px', height: '40px' }} >Add</Button>
                  <Button variant="contained" onClick={() => { removeItem(name) }} size="small" sx={{ width: '100px', height: '40px' }}>Remove</Button>
                </Stack>
              </Box>
            ))}
          </Stack>
        </Box>
        <Button variant="contained" onClick={() => {
          handleOpen()
        }}>
          Add new Item
        </Button>
      </Grid>
    </Box >
  );
}
