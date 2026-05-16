---
layout: default
title: スクリーンリーダーで Cursor CLI を使えるようにする
excerpt: Windows 環境で Cursor CLI を使う環境を整えたときの記録
categories:
  - 技術
tags:
  - 技術
  - vscode
  - cursor
  - ai
  - エンジニア
  - AIエディタ
  - スクリーンリーダー
---

今日は俺が普段使ってるエディタの話。

## 前置き

昨年、友人に勧められたこともあり、AI コーディングエディタである「Cursor（カーソル）」を契約した。これは VS Code のフォークなので、当然ながら VS Code と同じ感覚で使うことができる。また、拡張機能や設定プロファイルも丸ごと移行できる（環境によって動かない場合はあるかも）。

しかし、スクリーンリーダーで使った感想としては、個人的にやや重たいかなあと感じるときがある。とくに、AI と話しているときに、会話の内容を NVDA のブラウズモードで読み上げているときに感じる。

なるべくエディタ上で完結させなくてもよいことに振り切ることにしたのだ。でもそうしたら Cursor でなくてもよいよなあ……。そう思って Claude Code なども検討したが、私の使い方からすると費用のほうが高くつきそうだ。

## Cursor CLI

Cursor をコマンドで操作できればよいのだ。調べたら Cursor CLI というのがあるらしいではないか、ということで、サブ PC に環境構築してみたので、そのときの記録をメモしておく。

**試したことによって何かしらの損害が起きたとしても、筆者は責任を負いかねます。あらかじめご承知おきください。**

## 前提

- Cursor（カーソル）は、高度な AI 機能を内蔵したプログラミング用コードエディタだ。AI がコードを自動生成したり、バグを検知して修正したりと、まるで優秀なプログラマーが隣にいるような感覚で開発をサポートしてくれるらしい。
- 無料で利用することもできるので、操作感に慣れてからプロプランを契約する、といった使い方でもよい。
- Claude Code は Claude に寄せた体験だが、Cursor では様々な AI モデルを利用できるのが特徴だと思う。
- 前述のとおり VS Code 系なので、UI や設定ファイルは概ね共通だ。拡張機能もインポートできるはずだ。
- プランの詳細は適宜公式サイトで調べてほしい。

### インストール

Cursor 本体のセットアップは各自よろしくお願いする。Cursor CLI を動かすには **WSL** が必要になる。Ubuntu などでよいので、WSL の有効化と Ubuntu のインストールは済ませておいてほしい。スクリーンリーダー環境でのターミナル操作に慣れているであろう読者なら、特段難しいことはないはずだ。

1. Ubuntu のターミナルで次を実行する。

   ```bash
   curl https://cursor.com/install -fsSL | bash
   ```

2. インストールが終わると、ターミナルにたとえば次のようなメッセージが出る。

   - ✓ Package installed successfully
   - ✓ Symlink created
   - ✨ Installation Complete!

3. パスを通す。

   ```bash
   echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
   source ~/.bashrc
   ```

   zsh の場合は `~/.zshrc` に書く。

4. 動作確認。

   ```bash
   cursor-agent -v
   ```

5. 初回ログイン。`cursor-agent` を実行すると、ブラウザを開いて Cursor アカウントの認証を求められる。ブラウザでログインを承認すると、CLI 側が使えるようになる。

基本的なインストールは以上だ。

### 苦戦したところ：プロキシの設定

皆さん大好きプロキシについても、書いておかなければならない。ここを避けては通れないので設定する。AI と相談しながら解決したので、間違いがあるかもしれない。

現状 Cursor CLI には `HTTP_PROXY` / `HTTPS_PROXY` を完全にはサポートしていないようだ。そのため、WSL 側での環境変数設定と、HTTP/2 を無効化することで解決した。

#### 環境変数の設定

難しいことはない。`export https_proxy=http://proxy:port` のようにするだけだ。大文字・小文字、一応両方設定しておいた。

#### HTTP/2 をプロキシ越しに使わない設定で苦戦

その後、AI の解説を見てみると、`cursor-agent` のオプションとして `--disable-http2` がある、無効化するには `cursor-agent` だけでよい、とのことだった。

しかし、実際に試すと次のように出た。

```text
error: unknown option '--disable-http2'
```

他の指定方法も提示されていたがよくわからなかったので、IDE から手動で設定することにした。

1. Cursor を起動し、`Ctrl` + `,`（カンマ）で設定を開く。
2. 検索欄に `http2` と入力する。
3. **Network** › **HTTP Compatibility Mode** がヒットするので開く。
4. 説明文はだいたい次のとおりだ。

> **HTTP Compatibility Mode**  
> HTTP/2 is recommended for low-latency streaming. In some corporate proxy and VPN environments, the compatibility mode may need to be lowered.

その下にある（おそらく既定では HTTP/2）コントロールで、`Enter` で開き、矢印キーで **HTTP/1.1** を選べばよい。

---

## まとめ

今回はインストール方法なので、使い方についてはまた後日ということで。

---
