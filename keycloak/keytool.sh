#!/bin/bash -xe

# (0) 証明書類の構成
KEYSTORE_FILE=application.keystore
KEYSTORE_PASS=password
KEYALG=RSA
KEYSIZE=2048
ALIAS=server
CN=localhost
VALIDITY=3650

# (1) 自己署名証明書を生成する。
keytool -genkeypair -storetype PKCS12 \
    -keystore ${KEYSTORE_FILE} -storepass ${KEYSTORE_PASS} \
    -keyalg ${KEYALG} -keysize ${KEYSIZE} \
    -alias ${ALIAS} \
    -dname "CN=${CN}" \
    -ext "san=dns:${CN}" \
    -validity ${VALIDITY}

# (2) 生成したサーバ証明書をエクスポートする。
keytool -export \
    -keystore ${KEYSTORE_FILE} -storepass ${KEYSTORE_PASS} \
    -alias ${ALIAS} \
    -file ${ALIAS}.cert

# (3) 生成したサーバ証明書の情報を表示する。
keytool -printcert \
    -file ${ALIAS}.cert
