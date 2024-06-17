# =================================================================================== #
# HELPERS
# =================================================================================== #

## help: print this help message
.PHONY: help
help:
	@echo 'Usage:'
	@sed -n 's/^##//p' ${MAKEFILE_LIST} | column -t -s ':' | sed -e 's/^/ /'

.PHONY: confirm
confirm:
	@echo -n 'Are you sure? [y/N] ' && read ans && [ $${ans:-N} = y ]

# =================================================================================== #
# DEVELOPMENT / PRODUCTION
# =================================================================================== #

## install: install the node.js dependencies
.PHONY: install
install:
	@echo 'installing node.js dependencies...'
	@npm i

## start: start the node.js server
.PHONY: start
start: install
	@echo 'starting the server...'
	@npm start
