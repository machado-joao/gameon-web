# Projeto GameOn web
Este é um projeto de comércio eletrônico desenvolvido com MongoDB, Next.js e Tailwind CSS. A aplicação permite o cadastro e autenticação de usuários e a visualização dos produtos disponíveis. Além disso, permite que o administrador gerencie a plataforma.

## Acesso
O projeto foi hospedado na plataforma Vercel e pode ser acessado [clicando aqui](https://gameon-web.vercel.app/). Por outro lado, há a possibilidade de rodar o projeto localmente, basta seguir o passo a passo abaixo.

## Configuração do projeto
Para começar a utilizar a aplicação, siga as etapas abaixo:

### Clonar o projeto
Clone este repositório para o seu ambiente local usando o seguinte comando:

```bash
git clone https://github.com/machado-joao/gameon-web.git
```

### Abrir o projeto
Abra o projeto em um editor de código de sua preferência.

### Instalar dependências
Certifique-se de ter o Node.js e o npm instalados em seu sistema. Navegue até a raiz do projeto e execute o seguinte comando para instalar todas as dependências necessárias:

```bash
npm install
```

### Configurar variáveis de ambiente
Crie um arquivo chamado `.env` na raiz do projeto e adicione as seguintes variáveis de ambiente:

```makefile
NEXTAUTH_URL=http://localhost:3000/
NEXTAUTH_SECRET=secret
MONGODB_URI=mongodb+srv://paixaoariellll:GameOn20221@cluster0.mc4s5g8.mongodb.net/gameon-e-commerce?retryWrites=true&w=majority
PAYPAL_CLIENT_ID=AS99ZtzlMFiwm1woyRdr2cocdo0Vw0srObG8U8WqJZg4U4BsSIJZjfttxr8dY-Elfqiur0M-MVLne8cN
CLOUDINARY_URL=cloudinary://368193629939789:hIVbwLkXXheZaW7wNC-VxCj-vqU@dins1fpk3
CLOUDINARY_API_SECRET=hIVbwLkXXheZaW7wNC-VxCj-vqU
```

### Inicializar
Execute o comando a seguir para inicializar a aplicação e utilizá-la:

```bash
npm run dev
```

## Conclusão
Esta aplicação foi desenvolvida usando MongoDB, Next.js e Tailwind CSS e oferece recursos para registro de usuários, autenticação e visualização de produtos, assim como o gerenciamento da plataforma pelo administrador. Certifique-se de ter todas as dependências instaladas e configurar corretamente as variáveis de ambiente.
