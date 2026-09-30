# Evimde Sağlık

## Google Ads kurulum notu

Google Ads etiketlemesinde ana domain olarak `evimdesaglik.net` kullanılmalıdır. Diğer domain(ler) 301 yönlendirmesi ile bu ana domaine yönlenmelidir.

## Sayfalar (Google Ads site bağlantıları için)

| Sayfa | URL |
| --- | --- |
| Ana sayfa | https://evimdesaglik.net/ |
| Hizmetlerimiz | https://evimdesaglik.net/services.html |
| Evde Serum | https://evimdesaglik.net/evde-serum.html |
| Özel Ambulans | https://evimdesaglik.net/ozel-ambulans.html |
| Randevu ve İletişim | https://evimdesaglik.net/iletisim.html |

Ortak betikler (Tailwind ayarı, karanlık mod, mobil menü, slider, dönüşüm takibi) `assets/site.js` içindedir.

## Önceki hale geri dönmek

2026-10-01 toparlamasından önceki canlı hal `onceki-hal-2026-10-01` etiketi ve `yedek/onceki-hal` branch'inde saklıdır.
Siteyi o hale döndürmek için:

```
git checkout korunmus1
git revert --no-edit onceki-hal-2026-10-01..HEAD
git push origin korunmus1
```
