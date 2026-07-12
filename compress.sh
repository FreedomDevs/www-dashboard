#!/usr/bin/env bash
set -e

OUTDIR="../dist"

# функция для красивого вывода размеров с выравниванием и процентами
show_sizes() {
    local f="$1"
    local orig size_gz size_br # size_zst
    local perc_gz perc_br # perc_zst

    orig=$(stat -c%s "$f")
    [ -f "$f.gz" ] && size_gz=$(stat -c%s "$f.gz") || size_gz=0
    [ -f "$f.br" ] && size_br=$(stat -c%s "$f.br") || size_br=0

    # проценты сжатия
    perc_gz=$((100 - size_gz*100/orig))
    perc_br=$((100 - size_br*100/orig))

    printf "%-44s | %10s | %10s (%3s%%) | %10s (%3s%%)\n" \
        "$f" "$orig" "$size_gz" "$perc_gz" "$size_br" "$perc_br"
}

# заголовок
printf "%-48s | %10s | %17s | %17s\n" "Файл" "Orig" "Gzip" "Brotli"
printf "%0.s-" {1..99}; echo

# общий find
find "$OUTDIR" -type f \( -name '*.js' -o -name '*.css' -o -name "*.html" -o -name "*.svg" -o -name "*.json" -o -name "*.geojson" \) | while read f; do
    # gzip
    gzip -k -f -9 -n "$f"

    # brotli
    brotli -f -q 11 "$f"

    # вывод размеров
    show_sizes "$f"
done
