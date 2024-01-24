install:
	git submodule update --init
	mkdir -p ${shell pwd}/.yarn
	ln -nfs ${shell pwd}/yarn/.yarn/patches ${shell pwd}/.yarn/patches
	yarn install

generate:
	yarn exec tsx ./src/main.ts
	cp ${shell pwd}/_yarn ${HOME}/.zfunc
