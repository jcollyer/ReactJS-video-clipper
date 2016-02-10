WEBPACK_BIN = node_modules/.bin/webpack

default: install server

install:
	@npm install

server: $(WEBPACK_BIN)
	@NODE_ENV=development node server.js

build: $(WEBPACK_BIN)
	@$(WEBPACK_BIN)

deploy: build
	@node lib/deploy.js

#######
# BINS
#######

$(WEBPACK_BIN):
	@npm install

.PHONY: default clean server build test deploy

