# Dockerfile sourced from https://github.com/foxreymann/SolanaAnchorDocker/blob/master/Dockerfile

FROM --platform=linux/amd64 ubuntu:24.10

ARG DEBIAN_FRONTEND=noninteractive

ARG SOLANA_CLI
ARG NODE_VERSION="v20.16.0"

ENV HOME="/root"
ENV PATH="${HOME}/.cargo/bin:${PATH}"
ENV PATH="${HOME}/.local/share/solana/install/active_release/bin:${PATH}"
ENV PATH="${HOME}/.nvm/versions/node/${NODE_VERSION}/bin:${PATH}"

# Install base utilities.
RUN mkdir -p /workdir && mkdir -p /tmp && \
    apt-get update -qq && apt-get upgrade -qq && apt-get install -qq \
    build-essential git curl wget jq pkg-config python3-pip \
    libssl-dev libudev-dev zlib1g-dev llvm clang cmake make libprotobuf-dev protobuf-compiler

# Install rust.
RUN curl "https://sh.rustup.rs" -sfo rustup.sh && \
    sh rustup.sh -y && \
    rustup component add rustfmt clippy

# Install node / npm / yarn.
RUN curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
ENV NVM_DIR="${HOME}/.nvm"
RUN . $NVM_DIR/nvm.sh && \
    nvm install ${NODE_VERSION} && \
    nvm use ${NODE_VERSION} && \
    nvm alias default node && \
    npm install -g yarn

# Install Solana tools.
 RUN sh -c "$(curl -sSfL https://release.anza.xyz/stable/install)"
# WORKDIR /usr/src/app
# RUN git clone https://github.com/anza-xyz/agave.git
# WORKDIR /usr/src/app/agave
# RUN ./cargo build
# ENV PATH="/usr/src/app/agave/bin:${PATH}"


# Generate private key
RUN solana-keygen new --no-passphrase -o ~/.config/solana/id.json

RUN solana config set --url http://127.0.0.1:8899

RUN solana airdrop 2 || true

## Install anchor.
RUN cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
RUN avm install latest
RUN anchor --version


# Build a dummy program to bootstrap the BPF SDK (doing this speeds up builds).
# RUN mkdir -p /tmp && cd tmp && anchor init dummy && cd dummy && anchor build

WORKDIR /workdir

VOLUME /workdir