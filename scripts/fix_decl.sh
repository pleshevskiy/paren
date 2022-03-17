#!/bin/bash
for f in lib/*.d.mts;
do
  sed -i 's/.mjs"/.js"/' "$f"
  mv "$f" "${f//\.d\.mts/.d.ts}"
done
