
ts:
	npx tsc && make fix-decl

ts-w:
	npx tsc-watch --onSuccess "make fix-decl"

fix-decl:
	./scripts/fix_decl.sh

clean:
	rm -rf lib
