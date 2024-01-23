install:
	ln -nfs ${shell pwd}/yarn/.yarn/patches ${shell pwd}/.yarn/patches
	yarn install

generate:
	yarn exec tsx ./main.ts
	cp ${shell pwd}/_yarn ${HOME}/.zfunc
