# Blisspoint is an application repo that also ships StartOS packaging, so it
# cannot use the SDK's s9pk.mk: that expects `npm run build` to be the ncc
# bundle step, and here it is the Vite build. The packaging equivalents are
# `npm run startos:check` and `npm run startos:build`.

PKG_ID := blisspoint
# The build/release workflows read this with `make -s print-TARGETS` and fan out
# one matrix runner per target.
TARGETS := x86 arm

.PHONY: all x86 x86_64 arm arm64 aarch64 install clean check-deps

all: $(TARGETS)

print-%:
	@echo '$($*)'

x86 x86_64: $(PKG_ID)_x86_64.s9pk
arm arm64 aarch64: $(PKG_ID)_aarch64.s9pk

javascript/index.js: $(shell find startos -type f) node_modules
	npm run startos:check
	node node_modules/@start9labs/start-sdk/lint.mjs
	npm run startos:build

node_modules: package-lock.json package.json
	npm ci

# `startos` is the package root: every other input is named explicitly below, but
# README.md is resolved from this path alone and has no flag of its own — without
# it the pack ships the application's README instead of the package's.
$(PKG_ID)_%.s9pk: javascript/index.js startos/icon.png startos/instructions.md startos/README.md LICENSE | check-deps
	start-cli s9pk pack startos \
		--javascript $(CURDIR)/javascript \
		--icon startos/icon.png \
		--instructions startos/instructions.md \
		--license LICENSE \
		--assets $(CURDIR)/assets \
		--arch=$* \
		-o $@
	@start-cli s9pk inspect $@ manifest | jq -r '"\n✅ \(.title) v\(.version)  [\([.images[].arch] | flatten | unique | join(", "))]  sdk \(.sdkVersion)\n"'

install: | check-deps
	@S9PK=$$(start-cli s9pk select) || exit 1; \
	printf "\n🚀 Installing %s ...\n" "$$S9PK"; \
	start-cli package install -s "$$S9PK"

check-deps:
	@command -v start-cli >/dev/null || \
		(echo "Error: start-cli not found. See https://docs.start9.com/packaging/environment-setup.html" && exit 1)
	@command -v jq >/dev/null || (echo "Error: jq not found." && exit 1)

clean:
	rm -rf $(PKG_ID)_x86_64.s9pk $(PKG_ID)_aarch64.s9pk javascript
