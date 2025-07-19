import React, { useState, useEffect } from 'react'
import {
  Box,
  Input,
  Select,
  Button,
  VStack,
  Field,
  Heading,
  Stack,
  Portal,
} from '@chakra-ui/react'
import axios from 'axios'
import { toaster } from '../../components/ui/toaster'
import { useColorModeValue } from '../../components/ui/color-mode'
import { SelectComponent } from '../../components/form/SelectComponent'

export default function Transaction() {
  const [banks, setBanks] = useState([])
  const [categories, setCategories] = useState([])
  const [formData, setFormData] = useState({
    bank_id: '',
    category_id: '',
    amount: '',
    description: '',
    date: ''
  })

  useEffect(() => {
    fetchBanks()
    fetchCategories()
  }, [])

  const fetchBanks = async () => {
    try {
    let arr = []
      const response = await axios.get('http://localhost:8080/api/banks')
        response.data.data.map(bank => {
            arr.push({
                label: bank.bank_name,
                value: bank.id
            })
        })
        setBanks(arr)
    } catch (error) {
      console.error('Error fetching banks:', error)
      toaster.create({
        description: "Failed to fetch banks",
        type: "error",
      })
    }
  }

  const fetchCategories = async () => {
    try {
        let  arr = [];
      const response = await axios.get('http://localhost:8080/api/categories')
      response.data.data.map(category => {
        arr.push({
            label: category.CategoryName,
            value: category.ID
        })
      })

      setCategories(arr)

    } catch (error) {
      console.error('Error fetching categories:', error)
      toaster.create({
        description: "Failed to fetch categories",
        type: "error",
      })
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post('http://localhost:8080/api/transactions', formData)
      toaster.create({
        description: "Transaction recorded successfully",
        type: "success",
      })
      // Reset form after successful submission
      setFormData({
        bank_id: '',
        category_id: '',
        amount: '',
        description: '',
        date: ''
      })
    } catch (error) {
      console.error('Error recording transaction:', error)
      toaster.create({
        description: "Failed to record transaction",
        type: "error",
      })
    }
  }
const frameworks = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue" },
  { value: "angular", label: "Angular" },
];

  return (
    <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
            <Heading fontSize={'2xl'}>Record Transaction</Heading>
        </Stack>
        <Box rounded={'lg'} boxShadow={'xs'} p={5} bg={useColorModeValue('white', 'gray.700')}>
        <Field.Root required marginBottom="20px">
            <SelectComponent options={banks} label='Bank' placeholder='Select Bank' />
        </Field.Root>
        <Field.Root required marginBottom="20px">
            <SelectComponent options={categories} label='Category' placeholder='Select Category' />
        </Field.Root>
        <Field.Root required marginBottom="20px">
            <Field.Label> Amount <Field.RequiredIndicator /> </Field.Label>
            <Input
                type="number"
                name="amount"
                placeholder="Enter amount"
                value={formData.amount}
                onChange={handleInputChange}
            />
        </Field.Root>
        <Field.Root marginBottom="20px">
            <Field.Label>Description</Field.Label>
            <Input
                name="description"
                placeholder="Enter description"
                value={formData.description}
                onChange={handleInputChange}
            />
        </Field.Root>
              <Field.Root required marginBottom="20px">
                <Field.Label>
                    Date <Field.RequiredIndicator />
                </Field.Label>
                <Input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                />
            </Field.Root>
        <Button colorPalette="teal" variant="outline" type="submit" colorScheme="blue">
            Record Transaction
        </Button>
    </Box>
    </Stack>)
}