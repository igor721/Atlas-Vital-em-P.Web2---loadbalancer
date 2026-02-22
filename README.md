# 🚀 Load Balancer com Nginx + ReactJS + Docker

## 📌 Objetivo

Implementar um **Load Balancer com Nginx** utilizando o algoritmo **Round Robin**, distribuindo requisições para **5 nós contendo uma aplicação ReactJS**, utilizando apenas comandos básicos do Docker e configuração via volumes do host.

---

# 🏗️ Arquitetura da Solução

Cliente
↓
Nginx (Load Balancer)
↓
node1 | node2 | node3 | node4 | node5

- 5 containers executando a aplicação React
- 1 container Nginx atuando como Load Balancer
- Algoritmo: **Round Robin (padrão do Nginx)**

---

# 🛠️ Tecnologias Utilizadas

- ReactJS
- Nginx
- Docker
- Docker Network

---

# ⚙️ Processo Completo de Configuração

---

## 1️⃣ Criar rede Docker

docker network create react-net

## 2️⃣ Subir os 5 nós React

Cada nó utiliza a imagem oficial do Nginx para servir a aplicação React.

docker run -d --name node1 --network react-net \
-v $(pwd)/build:/usr/share/nginx/html nginx

docker run -d --name node2 --network react-net \
-v $(pwd)/build:/usr/share/nginx/html nginx

docker run -d --name node3 --network react-net \
-v $(pwd)/build:/usr/share/nginx/html nginx

docker run -d --name node4 --network react-net \
-v $(pwd)/build:/usr/share/nginx/html nginx

docker run -d --name node5 --network react-net \
-v $(pwd)/build:/usr/share/nginx/html nginx

Verificar containers:

docker ps

## 3️⃣ Configuração do Nginx

📄 nginx.conf

events {}

http {

    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    sendfile on;
    keepalive_timeout 65;

    include /etc/nginx/conf.d/*.conf;
}

📄 default.conf (Load Balancer)

upstream react_cluster {

    server node1:80;
    server node2:80;
    server node3:80;
    server node4:80;
    server node5:80;
}

server {

    listen 80;

    location / {

        proxy_pass http://react_cluster;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}

## 🔁 Algoritmo de Balanceamento

O Nginx utiliza Round Robin por padrão quando múltiplos servidores são declarados dentro do bloco upstream.

Isso significa que cada nova requisição será enviada sequencialmente para:
node1 → node2 → node3 → node4 → node5 → node1 ...

## 4️⃣ Subir o Load Balancer

docker run -d --name loadbalancer \
--network react-net \
-p 9090:80 \
-v $(pwd)/nginx.conf:/etc/nginx/nginx.conf \
-v $(pwd)/default.conf:/etc/nginx/conf.d/default.conf \
nginx

## 🌍 Acessar a aplicação

Abra no navegador:
http://localhost:9090

## 🐞 Problemas Encontrados e Soluções

## ❌ Problema 1 — Porta já alocada

Erro apresentado:

Bind for 0.0.0.0:8080 failed: port is already allocated

📌 Causa

A porta já estava sendo utilizada por outro container ou processo.

🔧 Solução

Verificar containers ativos:

docker ps

Remover container antigo:

docker rm -f loadbalancer

Ou utilizar outra porta:

-p 9090:80

## ❌ Problema 2 — Erro 403 Forbidden

Ao acessar:

http://localhost:9090

Retornava:

403 Forbidden
📌 Causa

A pasta build estava vazia.
O Nginx não encontrou o arquivo index.html.

🔧 Solução

Copiar corretamente o build da aplicação:

cp -r dist/* ./build/

## 🎯 Conclusão

O projeto demonstra a implementação prática de:

Balanceamento de carga com Nginx

Escalabilidade horizontal

Containerização com Docker

Encaminhamento do IP real

Configuração via volumes

A arquitetura permite fácil expansão adicionando novos servidores no bloco upstream.

