# Autenticacao com Facebook

> ## Dados:
* Token de Acesso

> ## Fluxo primario:
1. Obter dados (nome, email, e Facebook ID) da API do Facebook
2. Consultar se existe um usuario com o email recebido acima
3. Criar uma conta para o usuario com os dados recebidos do Facebook
4. Criar um token de acesso, a partir do ID do usuario, com expiracao de 30 minutos
5. Retornar o token de acesso gerado

> ## Fluxo alternativo: Usuario ja existe
3. Atualizar a conta do usuario com os dados recebidos do Facebook (Facebook ID e nome - so atualizar o nome caso a conta do usuario nao possua nome)

> ## Fluxo de excecao: Token invalido ou expirado
1. Retornar um erro de autenticacao
