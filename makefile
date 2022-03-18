
build:
	npx tsc && make fix-decl

watch:
	npx tsc-watch --onSuccess "make fix-decl"

fix-decl:
	./scripts/fix_decl.sh

clean:
	rm -rf lib
