// JavaScript da página inicio.html
// Dados simples dos produtos usados nas páginas.
var products = [
{id:1,name:"Pepperoni",price:55.90,category:"tradicional",description:"Molho de tomate, queijo muçarela e pepperoni fatiada.",image:"https://images.unsplash.com/photo-1628840042765-356cda07504e?w=900"},
{id:2,name:"Margherita",price:49.90,category:"tradicional",description:"Molho de tomate, muçarela, tomate fresco e manjericão.",image:"https://images.unsplash.com/photo-1579751626657-72bc17010498?w=900"},
{id:3,name:"Quatro Queijos",price:59.90,category:"especial",description:"Muçarela, parmesão, provolone e catupiry.",image:"https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=900"},
{id:4,name:"Calabresa",price:52.90,category:"tradicional",description:"Molho de tomate, muçarela, calabresa e cebola.",image:"https://images.unsplash.com/photo-1513104890138-7c749659a591?w=900"},
{id:5,name:"Frango com Catupiry",price:57.90,category:"especial",description:"Frango desfiado, muçarela e catupiry cremoso.",image:"https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=900"},
{id:6,name:"Vegetariana",price:54.90,category:"especial",description:"Muçarela, tomate, cebola, azeitona e pimentão.",image:"https://images.unsplash.com/photo-1573821663912-569905455b1c?w=900"}
];
function getData(key, fallback) {
var saved = localStorage.getItem(key);
if (saved) return JSON.parse(saved);
return fallback;
}
function saveData(key, value) {
localStorage.setItem(key, JSON.stringify(value));
}
function money(value) {
return value.toLocaleString("pt-BR", {style:"currency",currency:"BRL"});
}
function getProduct(id) {
for (var i=0;i<products.length;i++) if (products[i].id === Number(id)) return products[i];
return products[0];
}
function productCard(product) {
return '<article class="product-card"><a href="produto.html?id='+product.id+'"><img src="'+product.image+'" alt="'+product.name+'"></a><h3>'+product.name+'</h3><p>'+money(product.price)+'</p><a class="botao primario" href="produto.html?id='+product.id+'">Ver produto</a></article>';
}
function updateCartCount() {
var cart = getData("pizzaCart",[]);
var count = 0;
for (var i=0;i<cart.length;i++) count += cart[i].quantity;
var labels = document.querySelectorAll(".quantidade-carrinho");
for (var j=0;j<labels.length;j++) labels[j].textContent = count;
}
function addToCart(id, size, quantity) {
var cart = getData("pizzaCart",[]);
var found = false;
for (var i=0;i<cart.length;i++) {
if (cart[i].id === Number(id) && cart[i].size === size) {
cart[i].quantity += quantity; found = true;
}
}
if (!found) cart.push({id:Number(id),size:size,quantity:quantity});
saveData("pizzaCart",cart);
updateCartCount();
alert("Pizza adicionada ao carrinho!");
}
function renderMenu() {
var target = document.getElementById("produtosMenu");
if (!target) return;
var search = document.getElementById("pesquisaMenu").value.toLowerCase();
var category = document.getElementById("filtroCategoria").value;
var html = "";
for (var i=0;i<products.length;i++) {
var matchesName = products[i].name.toLowerCase().indexOf(search) !== -1;
var matchesCategory = category === "todas" || products[i].category === category;
if (matchesName && matchesCategory) html += productCard(products[i]);
}
target.innerHTML = html || '<p class="empty-state">Nenhuma pizza encontrada.</p>';
}
function renderProduct() {
var target = document.getElementById("detalhesProduto");
if (!target) return;
var params = new URLSearchParams(window.location.search);
var product = getProduct(params.get("id"));
target.innerHTML = '<div><img class="detail-photo" src="'+product.image+'" alt="'+product.name+'"></div><secao class="detail-info"><p class="subtitulo-banner">FEITA NA HORA</p><h1>'+product.name+'</h1><p class="detail-price">'+money(product.price)+'</p><div class="stars">★★★★★ <small>(4.8)</small></div><p class="description">'+product.description+'</p><h2>Tamanho</h2><div class="size-options"><button class="size-option" data-size="Pequena">Pequena</button><button class="size-option" data-size="Média">Média</button><button class="size-option selected" data-size="Grande">Grande</button></div><h2>Quantidade</h2><div class="quantity"><button id="minusQuantity">−</button><span id="quantityValue">1</span><button id="plusQuantity">+</button></div><button class="botao primario largura-total" id="addProduct">🛒 Adicionar ao carrinho</button></secao>';
var size = "Grande";
var quantity = 1;
var options = document.querySelectorAll(".size-option");
for (var i=0;i<options.length;i++) options[i].addEventListener("click",function(){
for (var j=0;j<options.length;j++) options[j].classList.remove("selected");
this.classList.add("selected"); size = this.getAttribute("data-size");
});
document.getElementById("minusQuantity").addEventListener("click",function(){if(quantity>1){quantity--;document.getElementById("quantityValue").textContent=quantity;}});
document.getElementById("plusQuantity").addEventListener("click",function(){quantity++;document.getElementById("quantityValue").textContent=quantity;});
document.getElementById("addProduct").addEventListener("click",function(){addToCart(product.id,size,quantity);});
}
function renderCart() {
var target = document.getElementById("itensCarrinho");
if (!target) return;
var cart = getData("pizzaCart",[]);
var subtotal = 0;
if (cart.length === 0) {
target.innerHTML = '<div class="empty-state"><h2>Seu carrinho está vazio</h2><p>Escolha uma pizza deliciosa no nosso cardápio.</p><a class="botao primario" href="cardapio.html">Ver cardápio</a></div>';
} else {
var html = "";
for (var i=0;i<cart.length;i++) {
var product = getProduct(cart[i].id);
var lineTotal = product.price * cart[i].quantity;
subtotal += lineTotal;
html += '<div class="cart-row"><img src="'+product.image+'" alt="'+product.name+'"><div><h3>'+product.name+'</h3><p>Tamanho: '+cart[i].size+' · Quantidade: '+cart[i].quantity+'</p><strong>'+money(lineTotal)+'</strong></div><button class="remove-btn" data-index="'+i+'">Remover</button></div>';
}
target.innerHTML = html;
var removeButtons = document.querySelectorAll(".remove-btn");
for (var j=0;j<removeButtons.length;j++) removeButtons[j].addEventListener("click",function(){
var current = getData("pizzaCart",[]);
current.splice(Number(this.getAttribute("data-index")),1);
saveData("pizzaCart",current); renderCart(); updateCartCount();
});
}
document.getElementById("subtotalCarrinho").textContent = money(subtotal);
document.getElementById("totalCarrinho").textContent = money(subtotal);
}
function renderOrders() {
var target = document.getElementById("listaPedidos");
if (!target) return;
var orders = getData("pizzaOrders",[]);
if (orders.length === 0) {target.innerHTML='<div class="empty-state"><h2>Você ainda não fez pedidos</h2><p>Seus pedidos finalizados aparecerão aqui.</p><a class="botao primario" href="cardapio.html">Escolher pizzas</a></div>';return;}
var html = "";
for (var i=orders.length-1;i>=0;i--) html += '<article class="order-card"><div><h3>Pedido #'+orders[i].number+'</h3><p>'+orders[i].date+' · '+orders[i].items+' item(ns)</p></div><div><strong>'+money(orders[i].total)+'</strong><p class="status">Pedido recebido</p></div></article>';
target.innerHTML = html;
}
function setupAuth() {
var tabs = document.querySelectorAll(".aba-autenticacao");
for (var i=0;i<tabs.length;i++) tabs[i].addEventListener("click",function(){
for (var j=0;j<tabs.length;j++) tabs[j].classList.remove("ativo");
this.classList.add("ativo");
var isLogin = this.getAttribute("data-auth") === "login";
document.getElementById("formularioLogin").classList.toggle("oculto",!isLogin);
document.getElementById("formularioCadastro").classList.toggle("oculto",isLogin);
});
var login = document.getElementById("formularioLogin");
if (login) login.addEventListener("submit",function(event){
event.preventDefault();
var email = document.getElementById("emailLogin").value;
var password = document.getElementById("senhaLogin").value;
var user = getData("pizzaUser",null);
if (user && user.email === email && user.password === password) {window.location.href="inicio.html";}
else document.getElementById("mensagemLogin").textContent = "Dados não encontrados. Faça seu cadastro primeiro.";
});
var register = document.getElementById("formularioCadastro");
if (register) register.addEventListener("submit",function(event){
event.preventDefault();
var user = {name:document.getElementById("nomeCadastro").value,email:document.getElementById("emailCadastro").value,phone:document.getElementById("telefoneCadastro").value,password:document.getElementById("senhaCadastro").value,address:""};
saveData("pizzaUser",user);
window.location.href="inicio.html";
});
}
function setupTheme() {
if (localStorage.getItem("pizzaTheme") === "light") document.body.classList.add("light-theme");
var buttons = document.querySelectorAll(".alternar-tema");
for (var i=0;i<buttons.length;i++) buttons[i].addEventListener("click",function(){
document.body.classList.toggle("light-theme");
var theme = document.body.classList.contains("light-theme") ? "light" : "dark";
localStorage.setItem("pizzaTheme",theme);
});
}
function setupSearch() {
var toggle = document.querySelector(".alternar-pesquisa");
var box = document.querySelector(".campo-pesquisa");
if (toggle && box) toggle.addEventListener("click",function(){box.classList.toggle("oculto");});
var submit = document.querySelector(".enviar-pesquisa");
if (submit) submit.addEventListener("click",function(){
var term = document.getElementById("pesquisaSite").value;
window.location.href = "cardapio.html?busca=" + encodeURIComponent(term);
});
var pesquisaMenu = document.getElementById("pesquisaMenu");
if (pesquisaMenu) {
var params = new URLSearchParams(window.location.search);
pesquisaMenu.value = params.get("busca") || "";
pesquisaMenu.addEventListener("input",renderMenu);
document.getElementById("filtroCategoria").addEventListener("change",renderMenu);
}
}
function setupProfile() {
var form = document.getElementById("formularioPerfil");
if (!form) return;
var user = getData("pizzaUser",{name:"",email:"",phone:"",address:""});
document.getElementById("nomePerfil").value = user.name || "";
document.getElementById("emailPerfil").value = user.email || "";
document.getElementById("telefonePerfil").value = user.phone || "";
document.getElementById("enderecoPerfil").value = user.address || "";
form.addEventListener("submit",function(event){
event.preventDefault();
user.name=document.getElementById("nomePerfil").value;
user.email=document.getElementById("emailPerfil").value;
user.phone=document.getElementById("telefonePerfil").value;
user.address=document.getElementById("enderecoPerfil").value;
saveData("pizzaUser",user);
document.getElementById("mensagemPerfil").textContent="Dados atualizados com sucesso!";
});
document.getElementById("botaoSair").addEventListener("click",function(){window.location.href="index.html";});
}
function setupCheckout() {
var button = document.getElementById("botaoPagamento");
if (!button) return;
button.addEventListener("click",function(){
var cart = getData("pizzaCart",[]);
if (cart.length === 0) {alert("Adicione pelo menos uma pizza.");return;}
var total = 0, items = 0;
for (var i=0;i<cart.length;i++){total += getProduct(cart[i].id).price * cart[i].quantity;items += cart[i].quantity;}
var orders = getData("pizzaOrders",[]);
orders.push({number:Date.now().toString().slice(-6),date:new Date().toLocaleString("pt-BR"),items:items,total:total});
saveData("pizzaOrders",orders);saveData("pizzaCart",[]);
alert("Pedido realizado com sucesso!");
window.location.href="pedidos.html";
});
}
document.addEventListener("DOMContentLoaded",function(){
setupAuth();setupTheme();setupSearch();setupProfile();setupCheckout();
updateCartCount();
var featured = document.getElementById("produtosDestaque");
if (featured) {var html="";for(var i=0;i<4;i++) html+=productCard(products[i]);featured.innerHTML=html;}
renderMenu();renderProduct();renderCart();renderOrders();
});
// Máscara de telefone simples: (00) 00000-0000
function phoneMask(input) {
if (!input) return;
input.addEventListener("input",function(){
var value = input.value.replace(/\D/g,"").substring(0,11);
if (value.length > 7) value = value.replace(/(\d{2})(\d{5})(\d{0,4})/,"($1) $2-$3");
else if (value.length > 2) value = value.replace(/(\d{2})(\d{0,5})/,"($1) $2");
else if (value.length > 0) value = "(" + value;
input.value = value;
});
}
document.addEventListener("DOMContentLoaded",function(){
phoneMask(document.getElementById("telefoneCadastro"));
phoneMask(document.getElementById("telefonePerfil"));
});
