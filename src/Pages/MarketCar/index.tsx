'use client'
import React, { useState, useEffect } from "react";
import './MarketCarStyle.css';
import axios from 'axios';


interface IProduct {
  id: number;
  imagem: string;
  titulo: string;
  valor: number;
}


const MarketCarPages = () => {
    const [products, setProducts] = useState<IProduct[]>([]);
    const [category, setCategory] = useState('sneakers');
    const [subcategory, setSubcategory] = useState('all');
    const [shoppingItems, setShoppingItems] = useState<IShoppingItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const subcategories = {
        sneakers: ['all', 'white', 'black', 'other'],
        tshirts: ['all', 'basketball', 'soccer']
    };

    useEffect(() => {
        axios.get(`https://98b7188d-bbc2-47cc-8359-39de648fa3ab-00-20xw8bphaskcz.picard.replit.dev/${category}`)
            .then(response => {
                setProducts(response.data[category]);
                setLoading(false);
            })
            .catch(error => {
                console.error('Erro ao buscar dados:', error);
                setError('Erro ao carregar os produtos');
                setLoading(false);
            });
    }, [category]);

    const handleAddProduct = (id: number) => {
        const product = products.find(p => p.id === id);
        const verifyingItem = shoppingItems.find(item => item.produto.id === id);

        if (verifyingItem) {
            const newItems = shoppingItems.map(item => {
                if (item.produto.id === id) {
                    return { ...item, quantidade: item.quantidade + 1 };
                }
                return item;
            });
            setShoppingItems(newItems);
        } else {
            const newItem: IShoppingItem = { produto: product!, quantidade: 1 };
            setShoppingItems([...shoppingItems, newItem]);
        }
    };

    const handleRemoveProduct = (id: number) => {
        const existsItem = shoppingItems.find(item => item.produto.id === id);
        if (existsItem!.quantidade > 1) {
            const newItems = shoppingItems.map(item => {
                if (item.produto.id === id) {
                    return { ...item, quantidade: item.quantidade - 1 };
                }
                return item;
            });
            setShoppingItems(newItems);
        } else {
            setShoppingItems(shoppingItems.filter(item => item.produto.id !== id));
        }
    };

    const handlePrint = () => {
        const printWindow = window.open('', '', 'height=600,width=800');
        if (printWindow) {
            printWindow.document.write('<html><head><title>Imprimir Carrinho</title>');
            printWindow.document.write('<style>body { font-family: Arial, sans-serif; }</style>');
            printWindow.document.write('</head><body>');
            printWindow.document.write('<h1>Itens do Carrinho</h1>');
            printWindow.document.write('<ul>');
            shoppingItems.forEach(item => {
                printWindow.document.write(`
                    <li>
                        <img src="${item.produto.imagem}" alt="${item.produto.titulo}" style="width:100px; height:auto;"><br>
                        Título: ${item.produto.titulo}<br>
                        Preço: R$ ${item.produto.valor.toFixed(2)}<br>
                        Quantidade: ${item.quantidade}<br>
                        Total: R$ ${(item.produto.valor * item.quantidade).toFixed(2)}
                    </li>
                    <style>
                    body{
                        background-color:black;
                        color: white;
                        display: grid;
                    }
                    img{
                        border-radius:10px;
                    }
                    </style>
                `);
            });
            printWindow.document.write('</ul>');
            printWindow.document.write('<p>Total Geral: R$ ' + totalItems.toFixed(2) + '</p>');
            printWindow.document.write('</body></html>');
            printWindow.document.close();
            printWindow.focus();
            printWindow.print();
        }
    };

    const totalItems = shoppingItems.reduce((total, item) => {
        return total + (item.produto.valor * item.quantidade);
    }, 0);

    const filteredProducts = products.filter(product => {
        if (subcategory === 'all') return true;
        return product.subcategory === subcategory;
    });

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="market-container">
            <div className="sidebar">
                <h2>Categorias</h2>
                <select className="custom-select" value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="sneakers">Sneakers</option>
                    <option value="tshirts">T-Shirts</option>
                </select>
                <ul className="subcategory-list">
                    {subcategories[category].map((sub) => (
                        <li key={sub}>
                            <button 
                                className={`subcategory-button ${subcategory === sub ? 'active' : ''}`}
                                onClick={() => setSubcategory(sub)}
                            >
                                {sub.charAt(0).toUpperCase() + sub.slice(1)}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="containerProduct">
                <h1>FizzS Store</h1>
                <div className="product-list">
                    {filteredProducts.map(product => (
                        <div className="product-item" key={product.id}>
                            <img src={product.imagem} alt={product.titulo} />
                            <p>{product.titulo}</p>
                            <p>R${product.valor.toFixed(2)}</p>
                            <button className="btnAdd" onClick={() => handleAddProduct(product.id)}>Adicionar</button>
                        </div>
                    ))}
                </div>
            </div>
            {shoppingItems.length > 0 && (
                <div id="containerCart" className="containerCart">
                    <h1>Carrinho de Compras (Total: R${totalItems.toFixed(2)})</h1>
                    <ul className="cart-list">
                        {shoppingItems.map(item => (
                            <div key={item.produto.id}>
                                <div className="divImg">
                                    <img className="imgCart" src={item.produto.imagem} alt={item.produto.titulo}/>
                                </div>
                                <p>Produto: {item.produto.titulo}</p>
                                <p>Preço: R${item.produto.valor.toFixed(2)}</p>
                                <p>Quantidade: {item.quantidade}</p>
                                <p>Total: R${(item.quantidade * item.produto.valor).toFixed(2)}</p>
                                <button className="btnRemove" onClick={() => handleRemoveProduct(item.produto.id)}>Remover</button>
                                <hr className="linha"/>
                            </div>
                        ))}
                        <button className="btnImprimirCart" onClick={handlePrint}>Imprimir Carrinho</button>
                    </ul>
                </div>
            )}
        </div>
    );
}

export default MarketCarPages;
