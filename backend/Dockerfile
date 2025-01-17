# Usar uma imagem base do Node.js baseada no Debian
FROM node:18

# Atualizar os pacotes e instalar o FFmpeg
RUN apt-get update && \
    apt-get install -y ffmpeg && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Definir o diretório de trabalho no contêiner
WORKDIR /app

# Copiar os arquivos de dependências
COPY package*.json ./

# Instalar dependências do Node.js
RUN npm install

# Copiar o restante do código
COPY . .

# Expor a porta da aplicação
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "start"]
