import React, { useState, useEffect } from "react";
import { Table, Input, InputNumber, Popconfirm, Form, Tooltip } from "antd";
import { PlusCircleTwoTone, MinusCircleTwoTone } from "@ant-design/icons";
import { globalVariable } from "../../utils/global-variable";
import "./AHSSumberTable.css";
const hostname = globalVariable("backendAddress");

// const originData = [
//     // {
//     //     //kategori AHS/AHSD
//     //     //id
//     //     key: "0",
//     //     name: `AHS Utama 0`,
//     //     noAHS: "1111",
//     //     kelompok: "Non-khusus",
//     //     sumber: "PUPR",
//     //     keterangan:
//     //         "fndjfnjksdnfd  f jnjdjgljkljggjfjalsd afjjdsklfjklsdf sdf sdfkl jfs",
//     //     gambar:
//     //         "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMTEhUTEhMVFhUVFRcXFxgYFRUYFRgXFxUWFxYVFxcYHSggGhomHRcVITEhJSkrLi4uFx8zODMsNygtLisBCgoKDg0OGhAQGi0mHx8tLS0tLS0tLS0tKy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIAKgBLQMBIgACEQEDEQH/xAAbAAABBQEBAAAAAAAAAAAAAAADAAIEBQYBB//EAD4QAAEDAgMFBgQFAgYBBQAAAAEAAhEDIQQSMQVBUWFxBhMigZGhMrHB0UJSYuHwI/EHFDOCktLCFVODorL/xAAZAQADAQEBAAAAAAAAAAAAAAABAgMABAX/xAAkEQACAgICAQQDAQAAAAAAAAAAAQIRAyESMUETIlFhBDJxkf/aAAwDAQACEQMRAD8AzOI+FVIeQrir8Kqsi7InRAeysnGuEPuU2phCdE9DqPyF/wAwEGpiEIYdwKc+mgxuCC0nyiZUGjZF72FkJLH8HCxcK4cQEN9ULMk8ckPhcLU2m9PcVhLalsBUalksiJ8IjN7ID2oblLqBCeEBGwAqorXShPpp7AmQskhxTYTlxEQY4ITmIr0xAIB9JCcxTCExzUrQSGlmR3MQXMStUEWZcJTCuJbMDqIRKJUQyozexkJJJJIYSSSSxhJJJLGEkkksaj0t4sq9wU6qPCqbGbQZTHiN9wGp+y6k6LK1sltKKHBZTE7cqO+GGD1PqVCGNqa947/kUPVSD6ptnqLUasyNrVZnMrLAbYDvC+Adx3H7IrInopHKm9lqykh4jD2snNqwnmrKoi6UGyodRcCnwVPc1ArNRaGlHYKk5SDUUdgRQyUpzZI7Od8unEIFWmUNwWYnFBu+kp0KE03UkVFiU4b0dckAhueiMKyEkqQ1JIlclMSOOauBhUvCNlbHs32TdWb3hgNmAXb+gSymo9hSb6MIWIZC2HbHs8cOASBBsC3Q/uscSspJmp+ThCG4IqG5FmAOCGWoxCaUjQSJUCEUaqEErnn2OhJJJJAiSSSWMJJJJYwkkkljG/29tAUaX6nWaOfE8gsJUeXGSZJVhtfEmrULtwOVo5Dem4fChzmt4x/PSVaWxnt0RMPQzZuQnzJACc3DEvygHWPorjBVKbaNV28ua1s8RLreyfsxz3P7x4LWCXOOW7iNAPMyp0vI6h0VFDBFxA5kegJ+ij1aJatZsxuYy5l2hzrabxHvCHjsLTzVLG2Qe4+octRR49F3/h5gmYim4v8AE5hywdwixPv6LQ7a7NMDS9jYIGm4gfVY7/D3FCji2gOGWp4HA8gS0+o91rdr7adiHGnRIFHQuE5nneBwb810KVR2el+O3OCvpdmbbgi6zQi0dih9s+mtiR6q0qeBoa0a28lM2XRhoUvXk3oSSTl7UVI7Ljc8+ig43Yr6fMcR/LLctbZCrtsUVkYs8akea12qM8K721SaHnLoqLE1gOZ4K9qrOOcJRlTGtYnFqZQqg6mOX3UmBrmHSVJ5kibxt+QBansCN3fU/wA5JwoWkXCMMsWLkg0iK9NDUR4XQFY5iRs4XXrfY/atN2HZTzAOZIIJibzIXkuD1R8W4wpThyBGfF2bb/E3bFJ1NtFrg52bMYM5QAR63XmTgjuuhlqaEOKoLk27BQmuCK4IbkwALkMorkNyUYi1kAqRWUcrmydjoSSSSQIkkkljCSSSWMJJJJYxOqWk+Q/nkpezcNUqOLaYlxaRO5oIgknpI81CcPh9fkvTezWEayk2B8TQTxMiVScqRbDDlIrsDSwFFgp1MjnC5Lokkak8Oi0OBZh3jNSDY3xEFSRsik4kljZdrYX6oxwjW3AuBA6cOii9o7aS6Q12Api4aJtu4aWVLi9g03ucTUgmJADd0xr1Pqr9wlqqsV2dY8l0uktgeJ0A28UA62SoB5vtfZxw2JDCcwdBB4g29QVvNk4TJTEjcqntDsJ3eYQOeX+PI4kDT4/k1y1lChIkp3OkPi9nJLpsru7MyrLDkKSMMDuXXUUsGOpIbmULH4qBzRqxLVU7SxAgq0Wh4q2Y3auKLnkNJF4tvKq6xydTdWmGYCXndmI8tXKoxsuJJ3lJKTbOTPJyk2DZSc8Et3a+aLgqLnODZIJ08l3A4VznQ38S2zdiNaxrm6+F/wD2/nJSnOicIWrZTUsPVaPHTa8cYh4/3NuFK7gGC0kO/K7Xydv858luG4UEC2oQK2zmOZlcAef1lJybKuKMFiqQm4yu5iJ/dRoVvt7Aupgz46X5tXN4Axu5qkw75tM8DyXZgy3pnFmw1tErCC6NjNELB6o2M0XUcZXppT4TSERgZQ3ozghOCAQLkNyK5DcgEiV0CFIrhBaJsuedDo6xkqTTwhKtNkbEfUIAFt50W82ZsKmwRAPkoymkdUMDe2eYP2e5RX0SNy9oOyaW9o9FCxWxaDrECTw1Q5oLwL5PICuLcbR7KOp1G1aQzBr2uLTwBBuOC0Xajs4zF0s9MtFVo8Ltzh+Rx4cOHqg5pMn6EqZ5MkiVqLmuLXAhzTBB1BG5DTkSyw1PO5o4h3sCfkF6VsGrmpsP6R8gvO+z9QDEUZ0zQf8AcC36r0HYtW5bAGUNIAnRzAZvzlNlOrAzT0NEsS0lNoOsoWMNWTBAb0M+aidMVydBgKuUCWEyMxhzQRvgSYPUqc3RUFWo8QWuJM6Eg/L7K3oPcWy4QYvdZ6GlDjsqtvVB3lAbzUJHlTfPz91Y0VkNvY4u2hRa2D3YcIJtmc2T7ZVpcLin/iaBzBlKxVstGJVYUSs4lsgwOIVLitqClEUn1M0gOuZIi2/jvgWN1rNXku6wBCy/aDDwJgq9wWJc8EmmWcJi/HRA2o2WkHeCjb7HjJxejD4ZoFPqD/8AafsoeLw9mHi77fujVH/h5D2BuigzSn8sHyELWQkWGwcBBk7j9FrKIGXoI95Wfo4lobDeSucI4mkJPxHz1Uuxl0XtNvhHRR6onUw0e/VSKb5Q8dhxUaWnQ2PCOBVKMU3+cNV4YymXUnAgvMZSOAGp66LJdoNhnD1A9g/puPo7geS9F2fs9lJoawAAaJu1MEKlNzDvHvuPqtddGq1s84w7YPVPxuimmhEtIgi46gw4fVQ8Zou/FPnGzzc0OMqK9cKcuKpEGUN6KUJ6wwFyG4IjihlBhIWJN0/CUczgEOuLqbsS9Zg/UubJ2Xgrkj0nYuByNC0VBkBVmBMgKzY5cqPQkxmJdA62CqsdjhShjBmqOsLgSeu4fy6un05vwVPS2TGI746gQLn5acfVECJ9Kl4QHXMX6oZw5bOTQ6t3dRzUxo3lPJB0QoJ53/iRssZWYho3hj+c/CT0gjzCwRXsnazZHf0TEnKcxa03cBrG7MNRumx1XmOI7P4gOhlN1QQCHMaSHNPwujUSNxTx6OTPH3WQcLVyvY78rmn0IK29PEP/AM1IIvSbl3SGkyDzv8lhQFtdjvD6dKp+KnY//k+oylWyrQMLqRrdn7TB8LvCeBVw14KpamGa4Akarv8A6dUb/p1CBwN1yKR2UXHdt1gKs23tinQZme4C8DiT0VJtTtA2hLX1g935aYBI6nRvmsZtTaT8VUZIAAMNEybnUneVWMXIlkyKPnZMrtL203F39R1ZznOHB7y0EHytyC2eA2FHdmXAsEEtJGffNT82pWd2hhsuHeR+HKG//GQPchx81uNnYkVKbXDRzQfUStMGF2iXhW+EjmhjBtBsEsPXaAb705zzqJj0SFh9VghUW0nK5NaQqXalgSsFGFYySDuvPup+Ao/03sO9p95+6rcJideT3ehBHzlTcBjfGZ3pqJNndiySJ1kSOe8LV1tpMoNAjM91mtESSdw4DmsdhsZ3WIE6EkHzMT9fNbXD4ek9weWgnjvU/I8aZL2O+tUGaoCy58NoiBF9Teb8lZtMGCnUIiybXoybFOCh2aDGqTnXiR9VGDoOSmLjU6xzJQcPTisSCTLQCTxE3HDX2WoZIoO0VAsrSNDD/TwuHpBVJjmrRdsagBYf0uB6GB81nMW4FshW/HdOjh/JXkriuFOXCF2HKDchvRnBBqLGAFDciFMcFgkHEap2Dq5XtdwK5itUEFc0+6LJ07PVNh4/MwGdythizIa34jfoOK8p2RtV1J2tlqMJtgilVqavJgdI8IHmSudxo74SUzZnE3hrpdw6RPnceoRcPic2uvBVnZ3Ad2wSS57ruJib6AxqpWMwxD2ubPOPqlGSLRrY4odaucri0TluefEDmgU3VMp/EfRS6r2tpxN/mdU0VYaE1wIBGhCwvaTNSfA75rCXFnc5mtiGyCKZF5k3/MtrgqcU2jgE1wuUHpizito8wwvZOsT4oA4gqwx+EqYek5tKg92YHM6ZAkRMC62jQmvecwAAIOpkiPYyqPI29kfSXg8qo7axLfCK1QRuLpiORSxW2MRUEVK1Rw4ZiB5gQF6dtHYFGt/qMaT+YS13/IXWYx/YMi9Kp5PH/kPsmUok5Y5+GYsBSMFUy1GOiYcDAuTBtZWzuyeKBjI0zvDxHnN/ZaXY+zKGEqBoivijdtiKdNv5+RHvZM5qifpuwe3qZbh2tILTUFg6x/N/Oqk9h6dUYVryZpkmP0jMRB5SPdXdXAsfeqG1HcXNBA5NB+EcvmomL2ODRNCm+pSpkzlY6BOu+YHECAkhONNS8lHHJFpwf9G47GOpvE0s06EEfVSKWOqvADQG9bn0TaGAhgZVqGpGhIAPKSPmpdCmG/ACo9HoLJDj1seynkbBJJ4nWVQ9oahNMtb8RIA8/wBpV3jKxDScpMDdc+QVDsoOqS94jMQQOAEged0LomZPEbPNMj35ydVEpS10/wAstht+hIkC4WazNaXNdEySBvA4EbuHkeCMXaJSSQLbdKXNd+Ya+gKu9lYqpSDcxDmGIcDbkCToVFx1NtXDuy6sGcceY9Fk21TpJ9THJFbE58Gez4LGSApr5c0gOykjXgvLNh9oKlOxdI5gk+y1dHtU2ASPQINUVUk9ovKWEqNGUOEbzvM7yp9CiG31Kzze0gd8FN77xZpImJiQFZUMQ94BMBp4GfdFyG5XozvbcRUZVvkg038ADcO8jKylGsQ8sdwjlIA+y9E25h2uoVAbDI7ygGCsH2jwAo1aRZ8LqbSDMg21Bj+WTY3uyGWOgcpSofepCoTpK7uSOHgSygVE0uPA+hQX1VuSNwY4obimGommog5INAcWFGUiq6UCFzy7GYlZbJ2l3bhNxOh0VbC61pOgJ6CUoYzcXaPX9ibQbUaHNIhG25jclJzv6hMWFNoc+TvANjGvQFYvsPiRScTVcKbbnxnLJi2vUrWbc23S7h2R7XOyy2LjMPhdMRY38kklR3qXKNljsrEmrSY8B7Zbo8Q6RYyBod/mgPxLmvLKrcwJlpaNxJgEceazGxO17gXf5gty7soMgySbCTefZTcX2upQ3u2VHRyFxPnvQ4sMckUuzYUqlpTRe/FYqv2qeRZkcjr1N1Dd2qxBJDKobG7uh/5LcWxHkiarFYgNA4n6a/T1T8NUzEZmxwH3VdtQmmwVHZTlc0CbXe5rYm/EeinYap4xvt6IsKaLMBIhMzLoclMNdT3prkVpXSLIGB95G5cdVlcmLJzWysYTWo7AoxOXojNcsAK9qpsW4MMaA3896ty5ZntnWDKTajm5wx7SW5i0OmRBIvEkeiHG9AcqVlJ2l24GA02gOcRfgAR79Fj2PJg72+4Jk+8nzKdjMUatR1RwALjMNs0cAAdyYBC6YY0kcc8rk7J+ExhYZ3HUclW1mw4xpNuiNMoTh7KdUUcuSFTdCucI0ObLqe74pj5iFV4dtwNf5xUzF4qSGDQamdSPoOCzVjRlRLoYl1MnuqjxcS22U7hIcCD6Kezbrwws/pixAu5sZvyhpAAndEXWbFaSZn9+aeax/vA3JlAHqU7NO3tDVzMBIyNEEC885deRu0Qts1xiC12Z/ga4BpaI8Rkmc3T0HBUWFqAlzulzpadFKe85fCd2uo3LdPQ1qW2WuzW0GEZ4k/ifp+y0WGq0jZpYehafkvPKdSo78YMJ5qOB8TQeYI+R+6VwvtgU14R6SMO07go2L2VRqAsc1skbozDmsCHuaZa5/QEC/ogOxBmchDt5i5PX1WUPsZ5F8AsXhKlN72EHwuI04GxQCx3CFYYeqQ0l0zzJnW+vVBbiRmktEdfdUsi4oacFpDusgiF2hRYQZvBiZg9Ru+alYh7j8Om6yi06jwbER5CVgaRMwmEaJlsjQFwBkcRbomF2V0ZTB0gC2ugaEWhiC+fDEaX1RwLfzqluinG1oaaRiBEHUeIjr+yNh2ZWxmnyAA6AKLnfm3BokzxEaa6pha4kOsLgzJiPWP7Iu2C0gmIMOEBknc7U8x7oZxDuIjhH2KLiKeaC03FwYkDyTHUD+YR780VRmpXoa+sD4nCzTxM3OilNbwGt1HZTBk5dAQJ39Eys2oTabamQAeiz+jK/Jbdudrh7hQYZDDLyN7tzfK/meS7hu1wZSa0M8bQB+kwIkH7rJEroR4aoVZWnZuq+2se1rnmlRa1sXLtcxIEHNG4+3FUtbtlij/7YHJp/7KFtXaTazGgMDMpPhbOQNgREnjNvTVVkpIRbXuDObvTPSOyfafv5p1AG1Be2jhxC04cvFsFinUqjajdWmfuPMWXrGzsc2qxr2mzgD+yScaK458lssKokIdOtuKQcmVAkLWPc+Nbjj90Om5zXDe0+3Qobqvp/NUyq7KJ1GvMdOKASyJWf7Z082Fqjg3N/xId9FY7Nx7KzM7DIkg2III1BB8lmu1m3mw+g0EkgtcTYCdQONt6eKbZGcklswzBF4Xc0px4BMMLqWjhFMLgK45NYdySSKQYem+NLFKnzSY3UcbJUnatOu7jI1aVMoOaxh5RreEenkcLQY49RxURnkni4MaD9p03pgJ/QZ7ySQQY3QOcrjGlrTeJtBOn7p1BxEzYTbSdP2XKtEPvNhwuNy1hrVnKRDRlvfpExZdLcwGYX6nRMAAAkyN0m3kE6oQ4QD6I2FfY8zYNgCNUM1onUn2TWyyzb77rjKY1dCwG2Hp082twm1AQfAwDn9p0XXPcLNiD1ulTqn8UBokX4oBbT0ddi8sNM6buf9011Gd5vcjzTw8RIhAxFQkgDQnhzRsD+w3fyMrPKN1telkZocyziSB6ygUacHNpHW56C8J7iXboMcLW3mVv6C2SMzXNm5G8XmyDSGYEgANH4eJJ1PHejsIiJkgf7o6ILabIgOOUmIjQ20O5BDNWFpAh/+2DIvbQA+fsg16cvmeAHLjpojOcxsvLvitE6wYsFDBzf6dO86E8d8LctglpUwzL2PiIOu8a7+CK+pw9zl9E1uDe2e8LWSJABbrmaB8Opgm2qtqOy6FQF5c65OjSG84AFullmaMl1ZkJXUgkFUkdSXF1AAgFrOw20YLqLjY+JvX8Q+R9Vk5T8PXcxwe0w5pkJ/QlJDxlxdnsDXJ+ZVOyNoitTa8b9RwI1CsGvXE1To607GYkOHiZc8Dv5clSYnblMB0OyuAPgcDZw/DyKvyVQ9odhNrjMPDUGh3EcHcue5NBRv3GcpJaA7H7XUnNyVRkd+aPAep3fy6i9qtnl/wDWpiYHijeNzuazn/pNXvhQIhx8xl/NPDVei4LCtp02sbo0Qr5lCDTiQjc00zzFcIWh7S7E7smpTH9Mm4/If+vyWeKaLtWc8otOmcFOdP7cyV2gBma0XJIudPIfdNqOtG7581zBuiow/qHzSyMiXiWhpbbWfY/2XcWwEB7Te08xutxGiNt+nGV3Aket/oq9rzGv3/spLZexwIPDn810VZAA8P1TWzeyYXDhGiYDbDVfFfUjcbIbWENO+eB0XWvtOs25pzah0gb9Fg6YymRAv14/z7J1bQAD+QhucJ06olMSZgaxcwb8LIio7hzmJBOikVsM3W55TCbVkCw66T5IWY7p85+qA30Jtc74EbvqnNqTfqmucI8ZE8EF+IGg+3qtYvQWiALTN5R6j2huhvpf6hVprHkOi53ztJWByLRr3FuVtr6205yjYaYMmTebc1Ao0zEqZsmlmrMG6Z9LrNaGhLdF1svYD3+MwwGNRLiN8jQSpO2thNpUg5pObMATA0g2EDjC0eGNlE7RNmg7xZYLTMT+IbkkW20UnFKLox+G2bmMnkBPADd/N6vKOyGtpfqJz+nDoqzAyZ8c9Wj5hyuqdSq1si41sM1uhEx04p8+KTSo4IZd7A0cO8TZrmuiAdbnTgRE3too5wNrscTJsMttDMbpk+inU6wLRBDcoubgTMAG4sTx81AficQ0wCTYaXMbphQeLInpnTCHNaa/0xaUpJLuyKpUIJKUkloK5IIpVnsFtLvAazczeEmB+rn0SSXXP9WVwRUsijLyaKlSbgqjiXHual2mZaDItbffXgFoqNcESDIN0kl5uVWlIeGm4/AYPSJXElEoR6tITmgTEA743jonU3nekkgwhHEEQbg2M6LE9o9jd0c9P/TJ0/KeHRJJPCTTJ5IpooHoRSSXQzkReU6grUYdY8eY3/ziqgUzJabR/PRJJRXZbwPbafb7IRqHikkmAx7nDeuBwnfPOVxJYzH91vEp/e30jTgST9EklgsaWmDY+sGSUiHm2g0SSWNWwFallMIJXUkCb7OIuGo5jG7ekkigF5ToZiG6D6K52fQDXBrREX58L+qSSGR+C+CK42aKiUzabM1JzZiRrExF9Ekkke0PP9WUGBwZmJny16hXT6JFMNAE3Fha94SSXXObujzscE4tgKGzg5pLyMpBB4EE3g+iNhDSpAhpcb5S43JLPD0jokkkvk9lV7I0j//Z",
//     //     // children: [
//     //     //     {
//     //     //         name: `Anak AHS 0-0`,
//     //     //         key: "0-0",
//     //     //         kelompok: "Bahan",
//     //     //         satuan: `OH`,
//     //     //     },
//     //     // ],
//     // },
// ];

// for (let i = 0; i < 20; i++) {
//     originData.push({
//         key: i.toString(),
//         name: `Judul AHS ${i}`,
//         noAHS: `1111${i}`,
//         kelompok: "Non-khusus",
//         satuan: `OH`,
//         sumber: "PUPR",

//         children: [
//             {
//                 name: `Anak AHS ${i}-0`,
//                 key: i.toString() + "-0",
//                 kelompok: "Bahan",
//                 satuan: `OH`,
//             },
//             {
//                 name: `Anak AHS ${i}-1`,
//                 key: i.toString() + "-1",
//                 kelompok: "Bahan",
//                 satuan: `OH`,
//                 keterangan:
//                     "barang ini cukup murah namun sulit ditemukan, hanya bisa didapatkan jika kita mnengimpor langsung dari amerikas serikat atau china.",
//             },
//         ],
//     });
// }

const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
}) => {
    var required = true;
    if (
        dataIndex == "noAHS" ||
        dataIndex == "satuan" ||
        dataIndex == "koefisien" ||
        dataIndex == "sumber" ||
        dataIndex == "keterangan" ||
        dataIndex == "gambar"
    ) {
        required = false;
    }
    const inputNode = inputType === "number" ? <InputNumber /> : <Input />;
    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{
                        margin: 0,
                    }}
                    rules={[
                        {
                            required: required,
                            message: `Please Input ${title}!`,
                        },
                    ]}
                >
                    {inputNode}
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};

const AHSSumberTable = () => {
    const [form] = Form.useForm();
    const [data, setData] = useState([]);
    const [editingKey, setEditingKey] = useState("");

    const isEditing = (record) => record.key === editingKey;

    const edit = (record) => {
        form.setFieldsValue({
            name: "",
            noAHS: "",
            kelompok: "",
            satuan: "",
            koefisien: "",
            ...record,
        });
        setEditingKey(record.key);
    };

    const cancel = () => {
        setEditingKey("");
    };

    const handleDelete = (key) => {
        console.log(key);
        try {
            const newData = [...data];
            const keysTemp = key.split("-");
            if (keysTemp.length == 2) {
                var childIndex = null;
                const index = newData.findIndex((item) => {
                    if (item.children !== undefined && item.children !== null) {
                        console.log(item);
                        childIndex = item.children.findIndex((child) => {
                            console.log(child);
                            return key === child.key;
                        });
                        if (childIndex === -1) {
                            return false;
                        } else {
                            return true;
                        }
                    } else {
                        // ga mungkin kesini harusnya
                        console.log("it's weird");
                        return key === item.key;
                    }
                });

                console.log(index);
                console.log(childIndex);

                if (index > -1) {
                    console.log("jol delete");
                    newData[index].children.splice(childIndex, 1);
                    setData(newData);
                } else {
                    console.log("situ");
                }
            } else {
                console.log("utama delete");
                const index = newData.findIndex((item) => key === item.key);
                if (index > -1) {
                    console.log("ketemu");
                    newData.splice(index, 1);
                    setData(newData);
                } else {
                    console.log("situ");
                }
            }
        } catch (errInfo) {
            console.log("Validate Failed:", errInfo);
        }

        // const keysTemp = key.split("-");
        // console.log(keysTemp);
        // const dataSource = [...data];
        // if (keysTemp.length == 2) {
        //     const index = dataSource.findIndex((item) => {
        //         if (item.children !== undefined && item.children !== null) {
        //             const childIndex = item.children.findIndex(
        //                 (child) => key === child.key
        //             );
        //             if (childIndex == null) {
        //                 return false;
        //             } else {
        //                 return true;
        //             }
        //         } else {
        //             return key === item.key;
        //         }
        //     });

        //     console.log(index);

        //     dataSource[index].children = dataSource[index].children.filter(
        //         (child) => {
        //             console.log(child.key);
        //             console.log(key);
        //             return child.key !== key;
        //         }
        //     );

        //     console.log(dataSource[index].children);
        //     if (dataSource[index].children.length == 0) {
        //         console.log("nah");
        //         delete dataSource[index]["children"];
        //     }

        //     console.log(key);
        //     console.log(dataSource);

        //     setData(dataSource);
        // } else {
        //     setData(dataSource.filter((item) => item.key !== key));
        // }
    };

    const save = async (key) => {
        try {
            const row = await form.validateFields();
            console.log(row);
            const newData = [...data];
            const keysTemp = key.split("-");
            if (keysTemp.length == 2) {
                var childIndex = null;
                const index = newData.findIndex((item) => {
                    if (item.children !== undefined && item.children !== null) {
                        childIndex = item.children.findIndex((child) => {
                            return key === child.key;
                        });
                        if (childIndex === -1) {
                            return false;
                        } else {
                            return true;
                        }
                    } else {
                        return row.key === item.key;
                    }
                });
                console.log(index);
                console.log(childIndex);

                if (index > -1) {
                    console.log("sini");
                    const item = newData[index].children[childIndex];
                    console.log(item);
                    console.log({ ...item, ...row });
                    newData[index].children.splice(childIndex, 1, {
                        ...item,
                        ...row,
                    });
                    console.log(newData);
                    setData(newData);

                    setEditingKey("");
                } else {
                    console.log("situ");
                    newData.push(row);
                    setData(newData);
                    setEditingKey("");
                }
            } else {
                console.log("utama ngedit");
                const index = newData.findIndex((item) => key === item.key);
                if (index > -1) {
                    console.log("ketemu");
                    const item = newData[index];
                    newData.splice(index, 1, { ...item, ...row });
                    setData(newData);
                    setEditingKey("");
                } else {
                    newData.push(row);
                    setData(newData);
                    setEditingKey("");
                }
            }
        } catch (errInfo) {
            console.log("Validate Failed:", errInfo);
        }
    };

    const columns = [
        {
            title: "No AHS",
            dataIndex: "noAHS",
            width: 70,
            editable: true,
            required: false,
        },
        {
            title: "Sumber",
            dataIndex: "sumber",
            width: "15%",
            editable: true,
            required: false,
        },
        {
            title: "Nama AHS / Nama Uraian",
            dataIndex: "name",
            width: "40%",
            editable: true,
            required: true,
        },
        {
            title: "Kelompok",
            dataIndex: "kelompok",
            width: 120,
            editable: true,
            required: true,
        },
        {
            title: "Satuan",
            dataIndex: "satuan",
            width: 65,
            editable: true,
            required: false,
        },
        {
            title: "Koef",
            dataIndex: "koefisien",
            width: 65,
            editable: true,
            required: false,
        },
        {
            title: "Keterangan",
            dataIndex: "keterangan",
            width: 150,
            editable: true,
            required: false,
            ellipsis: {
                showTitle: true,
            },
            render: (keterangan) => (
                <Tooltip placement="topLeft" title={keterangan}>
                    {keterangan}
                </Tooltip>
            ),
        },
        {
            title: " ",
            dataIndex: "gambar",
            width: 30,
            editable: false,
            required: false,
            ellipsis: {
                showTitle: true,
            },
            render: (gambar, record) =>
                gambar !== undefined && (
                    <Tooltip placement="topLeft" title={<img src={gambar} />}>
                        {/* {"[]"} */}
                        {record.name}
                    </Tooltip>
                ),
        },
        {
            title: "operation",
            width: 120,
            dataIndex: "operation",
            render: (_, record) => {
                const editable = isEditing(record);
                return editable ? (
                    <span>
                        <a
                            //href="javascript:;"
                            onClick={() => save(record.key)}
                            style={{
                                marginRight: 8,
                            }}
                        >
                            Save
                        </a>
                        <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
                            <a>Cancel</a>
                        </Popconfirm>
                    </span>
                ) : data.length >= 1 ? (
                    <div>
                        <a
                            disabled={editingKey !== ""}
                            onClick={() => edit(record)}
                        >
                            Edit
                        </a>
                        <Popconfirm
                            title="Sure to delete?"
                            onConfirm={() => handleDelete(record.key)}
                        >
                            <a> Delete </a>
                        </Popconfirm>
                    </div>
                ) : null;
            },
        },
        {
            title: " ",
            dataIndex: "khusus",
            width: 35,
        },
    ];

    const mergedColumns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }

        return {
            ...col,
            onCell: (record) => ({
                record,
                inputType: col.dataIndex === "koefisien" ? "number" : "text",
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });

    useEffect(() => {
        fetch(hostname + "/data-source/get-ahs-sumber-full-data", {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        })
            .then((response) => response.json())
            .then((response) => {
                console.log(response);
                var tableData = response.AHS.map((ahs, idx) => {
                    const data = {
                        id: ahs.ID_AHS_SUMBER_UTAMA,
                        isAHS: true,
                        key: idx.toString(),
                        name: ahs.NAMA_AHS,
                        noAHS: ahs.NOMOR_AHS,
                        kelompok: ahs.KHUSUS ? "Khusus" : "Non-Khusus",
                        satuan: ahs.SATUAN_AHS,
                        sumber: ahs.SUMBER_AHS,
                        children: ahs.AHS_SUMBER_DETAILs.map((ahsd, i) => {
                            return {
                                key: idx.toString() + "-" + i.toString(),
                                id: ahsd.ID_AHS_SUMBER_DETAIL,
                                isAHS: false,
                                name: ahsd.URAIAN,
                                kodeUraian: ahsd.KODE_URAIAN,
                                noAHS: ahsd.ID_AHS_SUMBER_UTAMA,
                                kelompok: ahsd.KELOMPOK_URAIAN,
                                satuan: ahsd.SATUAN_URAIAN,
                                koefisien: ahsd.KOEFISIEN_URAIAN,
                                keterangan: ahsd.KETERANGAN_URAIAN,
                            };
                        }),
                    };
                    if (data.children.length == 0) {
                        delete data.children;
                    }
                    return data;
                });
                return tableData;
            })
            .then((tableData) => {
                setData(tableData);
            });
    }, []);

    return (
        <Form form={form} component={false}>
            <Table
                components={{
                    body: {
                        cell: EditableCell,
                    },
                }}
                rowClassName={(record) => record.color.replace("#", "")}
                bordered
                dataSource={data}
                columns={mergedColumns}
                rowClassName="editable-row"
                pagination={{
                    onChange: cancel,
                }}
                expandable={{
                    expandIconColumnIndex: columns.length - 1,
                }}
                size="small"
            />
        </Form>
    );
};

export default AHSSumberTable;
