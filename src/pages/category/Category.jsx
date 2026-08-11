import React, { useState, useEffect } from 'react';
import { Box, Spinner, Flex, VStack, Text } from "@chakra-ui/react";
import { toaster } from "./../../components/ui/toaster";
import { useColorModeValue } from '../../components/ui/color-mode';
import axios from 'axios';
import Config from '../../components/axios/Config';

// Category Subcomponents
import CategoryHeader from '../../components/category/CategoryHeader';
import CategoryTable from '../../components/category/CategoryTable';
import CategoryEmptyState from '../../components/category/CategoryEmptyState';
import CategoryModal from '../../components/category/CategoryModal';

export default function Category() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const [error, setError] = useState(null);
  const [categoryName, setCategoryName] = useState('');
  const [description, setDescription] = useState('');

  const pageBg = useColorModeValue('gray.50', 'gray.900');
  const subtitleColor = useColorModeValue('gray.600', 'gray.400');

  useEffect(() => {
    fetchCategory();
  }, []);

  const fetchCategory = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    const url = import.meta.env.VITE_API_URL + 'categories';

    try {
      const response = await axios.get(url, Config({ Authorization: `Bearer ${token}` }));
      setCategories(response.data.data || []);
    } catch (err) {
      console.error(err);
      setError(err);
      toaster.create({
        description: "Failed to fetch categories",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async () => {
    if (!categoryName) {
      toaster.create({
        description: "Please enter a category name",
        type: "error",
      });
      return;
    }

    setLoading(true);

    const body = {
      categoryName,
      description
    };

    const token = localStorage.getItem('token');
    const url = import.meta.env.VITE_API_URL + 'categories';

    try {
      const response = await axios.post(url, body, Config({ Authorization: `Bearer ${token}` }));
      setCategories([...categories, response.data.data]);
      setModal(false);
      setCategoryName('');
      setDescription('');
      toaster.create({
        description: "Category created successfully",
        type: "success",
      });
    } catch (err) {
      console.error(err);
      setError(err);
      toaster.create({
        description: "Failed to create category",
        type: "error",
      });
    } finally {
      setLoading(false);
      setError(null);
    }
  };

  const deleteCategory = async (id) => {
    setLoading(true);
    const token = localStorage.getItem('token');
    const url = import.meta.env.VITE_API_URL + 'categories/' + id;

    try {
      const response = await axios.delete(url, Config({ Authorization: `Bearer ${token}` }));
      if (response.data.success) {
        setCategories(categories.filter(category => category.ID !== id));
        toaster.create({
          description: "Category deleted successfully",
          type: "success",
        });
      }
    } catch (err) {
      toaster.create({
        description: "Failed to delete category",
        type: "error",
      });
      console.error(err);
      setError(err);
    } finally {
      setLoading(false);
      setError(null);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      deleteCategory(id);
    }
  };

  const handleOpenModal = () => {
    setCategoryName('');
    setDescription('');
    setModal(true);
  };

  return (
    <Box minH="100vh" bg={pageBg}>
      <Box maxW="7xl" mx="auto" px={{ base: 4, sm: 6, lg: 8 }} py={8}>
        {/* Header */}
        <CategoryHeader onOpenModal={handleOpenModal} />

        {/* Content Section */}
        {loading ? (
          <Flex justify="center" align="center" py={16}>
            <VStack gap={3}>
              <Spinner size="xl" color="blue.500" />
              <Text color={subtitleColor} fontSize="sm">Loading categories...</Text>
            </VStack>
          </Flex>
        ) : categories.length > 0 ? (
          <CategoryTable categories={categories} onDelete={handleDelete} />
        ) : (
          <CategoryEmptyState onOpenModal={handleOpenModal} />
        )}
      </Box>

      {/* Modal Dialog */}
      <CategoryModal
        open={modal}
        onOpenChange={(e) => setModal(e.open)}
        categoryName={categoryName}
        setCategoryName={setCategoryName}
        description={description}
        setDescription={setDescription}
        onAddCategory={handleAddCategory}
        loading={loading}
      />
    </Box>
  );
}
