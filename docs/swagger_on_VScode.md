# Swagger SpecでAPIドキュメントを書いて静的HTMLを生成するまでの流れ

Swaggerと検索した時に、いろんな情報が出てくるので、自分の書いた方法をまとめました。

## 環境

- CentOS 7
- Visual Studio Code 1.42.1
- node 10.16.3
- redoc-cli 0.9.6

## Swaggerについて

SwaggerはRESTAPIドキュメントを文章化する仕様、およびツール群です。  
API仕様としてのSwaggerはOpenAPIという名前になっていますが、ツール群は`Swagger UI`、`Swagger Editor`等が存在します。

OpenAPI文章では、yamlからフォーマットされたAPIドキュメントを生成する他に  
実際のAPIにリクエストを送り、実際のレスポンスを検証することが出来ます。

今回は、VSCode上で補完を利かせながらyamlを書き、node.jsパッケージであるredoc-cliを利用して静的HTMLにしてみたので共有します。

---

## VSCode

VSCodeでswaggerを書く場合、補完およびスキーマバリデーションを効かせることができます。  

まず拡張機能`YAML`を導入します。  
[YAML Support by Red Hat](https://marketplace.visualstudio.com/items?itemName=redhat.vscode-yaml)

もしくはコンソールから、

```sh
code --install-extension redhat.vscode-yaml
```

schemaを`settings.json`に記述します。  
今回はOpenAPIのversion3で記述していくので、他のバージョンの場合URLが異なるので注意。  
globパターンでスキーマバリデーションを利かせる特定のファイルを指定します。

```json
  "yaml.schemas": {
    "https://raw.githubusercontent.com/kogosoftwarellc/open-api/master/packages/openapi-schema-validator/resources/openapi-3.0.json": [
      "*swagger.yaml",
      "*swagger.yml"
    ]
  }
```

---

## swagger.yaml

OpenAPIv3形式で記述していきます。  


- 一般情報  
`info`には`title`、`version`等を記述していきます。
`openapi`および`info`は必須です。  
[OpenAPI Specification #infoObject](https://swagger.io/specification/#infoObject)

```yaml
openapi: 3.0.0
info:
  title: Swagger Sample API
  version: 1.0.0
  contact:
    name: ragnar
    url: https://ragnar1904.com/support
    email: info@ragnar1904.com
  license:
    name: Apache 2.0
    url: https://www.apache.org/licenses/LICENSE-2.0.html
  termsOfService: https://ragnar1904.com/terms
```

- リクエスト用サーバーの設定  
リクエストをテストするAPIサーバーの設定を記述します。  
`{host}:{port}`としたところは、HTML上で値を指定出来ます。また、デフォルト値を設定できます。  
[OpenAPI Specification #serverObject](https://swagger.io/specification/#serverObject)

```yaml
servers:
  - url: https://dev.sample.jp/api/v1
    description: development server
  - url: http://{host}:{port}/api/v1
    description: local server
    variables:
      host:
        default: localhost
      port:
        default: 8000
```

- パスの設定  
APIのパスを書いていきます。  
slagの部分は`{user_id}`とし、parametersを書きます。  
[OpenAPI Specification #pathsObject](https://swagger.io/specification/#pathsObject)

```yaml
paths:
  /user/{user_id}:
    get:
      description: ユーザー情報取得API
      security:
        - ApiKeyAuth: []
      parameters:
        - in: path
          name: user_id
          description: ユーザーのID
          required: True
          schema:
            type: string
        # securityで仕様するパラメータはここに記述する必要はないが、
        # 認証に気づきやすくするように記述。
        - in: header
          name: X_AUTH_TOKEN
          description: 認証コード
          required: True
          schema:
            type: string
      responses:
        200:
          description: 正常なステータス
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/user_detail"
        403:
          description: API認証失敗時のレスポンス

components:
  schemas:
    user_detail:
      description: ユーザー情報
      type: object
      properties:
        pk:
          type: string
          format: uuid
        email:
          type: string
          format: email
        # nested object
        group:
          type: array
          items:
            type: object
            properties:
              id:
                type: string
                format: uuid
              name:
                type: string
        last_name:
          type: string
        first_name:
          type: string
        profile:
          type: string
          nullable: true

  securitySchemes:
    ApiKeyAuth:
      type: apiKey
      in: header
      name: X_AUTH_TOKEN
```

APIドキュメントでは、同じようなオブジェクト構造がでてくるので、schemaを設定することが出来ます。  
`$ref: #components/schemas/<schema_name>`として参照出来ます。  
他にもいろいろな構造をcomponents内に記述し、参照することが出来ます。  
[OpenAPI Specification #componentsObject](https://swagger.io/specification/#componentsObject)

APIの認証がある場合は、  
`components/securitySchemes`に記述します。Basic認証やOAuth2等にも対応しています。  
[OpenAPI Specification #securitySchemeObject](https://swagger.io/specification/#securitySchemeObject)

patch, delete等も書いていきます。

```yaml
    patch:
      description: ユーザー情報アップデートAPI
      security:
        - ApiKeyAuth: []
      parameters:
        - in: path
          name: user_id
          description: ユーザーのID
          required: True
          schema:
            type: string
        - in: header
          name: X_AUTH_TOKEN
          description: 認証コード
          required: True
          schema:
            type: string
      requestBody:
        content:
          application/json:
            schema:
            $ref: "#/components/schemas/user_detail"
      responses:
        200:
          description: 正常なステータス
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/user_detail"
        403:
          description: API認証失敗時のレスポンス

    delete:
      description: ユーザー削除API
      security:
        - ApiKeyAuth: []
      parameters:
        - in: path
          name: user_id
          description: ユーザーのID
          required: True
          schema:
            type: string
        - in: header
          name: X_AUTH_TOKEN
          description: 認証コード
          required: True
          schema:
            type: string
      responses:
        204:
          description: 正常なステータス
        403:
          description: API認証失敗時のレスポンス
```

## 可視化する

[Swagger Editor](http://editor.swagger.io/#)にyamlを貼り付けると、GUIになった画面が表示されます。  
VSCodeの場合であれば、拡張機能に[Swagger Viewer](https://marketplace.visualstudio.com/items?itemName=Arjun.swagger-viewer)というものがあり、Swagger Editorと同じ書き心地で記述出来ます。  

## 静的HTMLにバンドル

yamlで記述したOpenAPI文章を、どこかでホストするには、HTMLに書きだす必要があります。  
サーバーを立てるパッケージやそれを利用したDockerイメージ等もあるのですが、  
静的HTMLに吐き出せるのが一番手軽に感じます。

今回は`redoc`というNode.jsパッケージを使用します。

### 導入

```bash
$ yarn add redoc-cli -D
```

### 実行

```bash
$ redoc-cli bundle path/to/swagger.yaml --output path/to/bundle.html
```

これだけで、静的HTMLが吐き出されます。  
あとはこれをGitHubPagesやwebServer等で配信するだけです。

