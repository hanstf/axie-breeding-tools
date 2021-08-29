const BigNumber = require('bignumber.js');
const axios = require('axios');
const fs = require('fs');

const regionGeneMap = {"00000": "global", "00001": "japan"};
const classGeneMap = {
    "0000": "beast",
    "0001": "bug",
    "0010": "bird",
    "0011": "plant",
    "0100": "aquatic",
    "0101": "reptile",
    "1000": "???",
    "1001": "???",
    "1010": "???"
};
const binarytraits = {
    "beast": {
        "eyes": {
            "001000": {
                "global": "Puppy"
            },
            "000010": {
                "global": "Zeal",
                "mystic": "Calico Zeal"
            },
            "000100": {
                "global": "Little Peas",
                "xmas": "Snowflakes"
            },
            "001010": {
                "global": "Chubby"
            }
        },
        "ears": {
            "001010": {
                "global": "Puppy"
            },
            "000100": {
                "global": "Nut Cracker"
            },
            "000010": {
                "global": "Nyan",
                "mystic": "Pointy Nyan"
            },
            "000110": {
                "global": "Innocent Lamb",
                "xmas": "Merry Lamb"
            },
            "001000": {
                "global": "Zen"
            },
            "001100": {
                "global": "Belieber"
            }
        },
        "back": {
            "001000": {
                "japan": "Hamaya",
                "global": "Risky Beast"
            },
            "000100": {
                "global": "Hero"
            },
            "000110": {
                "global": "Jaguar"
            },
            "000010": {
                "mystic": "Hasagi",
                "global": "Ronin"
            },
            "001010": {
                "global": "Timber"
            },
            "001100": {
                "global": "Furball"
            }
        },
        "horn": {
            "001000": {
                "japan": "Umaibo",
                "global": "Pocky"
            },
            "000100": {
                "global": "Imp",
                "japan": "Kendama"
            },
            "000110": {
                "global": "Merry"
            },
            "000010": {
                "mystic": "Winter Branch",
                "global": "Little Branch"
            },
            "001010": {
                "global": "Dual Blade"
            },
            "001100": {
                "global": "Arco"
            }
        },
        "tail": {
            "000100": {
                "global": "Rice"
            },
            "000010": {
                "global": "Cottontail",
                "mystic": "Sakura Cottontail"
            },
            "000110": {
                "global": "Shiba"
            },
            "001000": {
                "global": "Hare"
            },
            "001010": {
                "global": "Nut Cracker"
            },
            "001100": {
                "global": "Gerbil"
            }
        },
        "mouth": {
            "000100": {
                "global": "Goda"
            },
            "000010": {
                "global": "Nut Cracker",
                "mystic": "Skull Cracker"
            },
            "001000": {
                "global": "Axie Kiss"
            },
            "001010": {
                "global": "Confident"
            }
        }
    },
    "bug": {
        "mouth": {
            "001000": {
                "japan": "Kawaii",
                "global": "Cute Bunny"
            },
            "000010": {
                "global": "Mosquito",
                "mystic": "Feasting Mosquito"
            },
            "000100": {
                "global": "Pincer"
            },
            "001010": {
                "global": "Square Teeth"
            }
        },
        "horn": {
            "001010": {
                "global": "Parasite"
            },
            "000010": {
                "global": "Lagging",
                "mystic": "Laggingggggg"
            },
            "000110": {
                "global": "Caterpillars"
            },
            "000100": {
                "global": "Antenna"
            },
            "001000": {
                "global": "Pliers"
            },
            "001100": {
                "global": "Leaf Bug"
            }
        },
        "tail": {
            "001000": {
                "global": "Gravel Ant"
            },
            "000010": {
                "mystic": "Fire Ant",
                "global": "Ant"
            },
            "000100": {
                "global": "Twin Tail"
            },
            "000110": {
                "global": "Fish Snack",
                "japan": "Maki"
            },
            "001010": {
                "global": "Pupae"
            },
            "001100": {
                "global": "Thorny Caterpillar"
            }
        },
        "back": {
            "001000": {
                "global": "Sandal"
            },
            "000010": {
                "global": "Snail Shell",
                "mystic": "Starry Shell"
            },
            "000100": {
                "global": "Garish Worm",
                "xmas": "Candy Canes"
            },
            "000110": {
                "global": "Buzz Buzz"
            },
            "001010": {
                "global": "Scarab"
            },
            "001100": {
                "global": "Spiky Wing"
            }
        },
        "ears": {
            "000010": {
                "global": "Larva",
                "mystic": "Vector"
            },
            "000110": {
                "global": "Ear Breathing"
            },
            "000100": {
                "global": "Beetle Spike"
            },
            "001000": {
                "global": "Leaf Bug"
            },
            "001010": {
                "global": "Tassels"
            },
            "001100": {
                "japan": "Mon",
                "global": "Earwing"
            }
        },
        "eyes": {
            "000010": {
                "global": "Bookworm",
                "mystic": "Broken Bookworm"
            },
            "000100": {
                "global": "Neo"
            },
            "001010": {
                "global": "Kotaro?"
            },
            "001000": {
                "global": "Nerdy"
            }
        }
    },
    "aquatic": {
        "eyes": {
            "001000": {
                "global": "Gero"
            },
            "000010": {
                "global": "Sleepless",
                "mystic": "Insomnia",
                "japan": "Yen"
            },
            "000100": {
                "global": "Clear"
            },
            "001010": {
                "global": "Telescope"
            }
        },
        "mouth": {
            "001000": {
                "global": "Risky Fish"
            },
            "000100": {
                "global": "Catfish"
            },
            "000010": {
                "global": "Lam",
                "mystic": "Lam Handsome"
            },
            "001010": {
                "global": "Piranha",
                "japan": "Geisha"
            }
        },
        "horn": {
            "001100": {
                "global": "Shoal Star"
            },
            "000110": {
                "global": "Clamshell"
            },
            "000010": {
                "global": "Babylonia",
                "mystic": "Candy Babylonia"
            },
            "000100": {
                "global": "Teal Shell"
            },
            "001000": {
                "global": "Anemone"
            },
            "001010": {
                "global": "Oranda"
            }
        },
        "ears": {
            "000010": {
                "global": "Nimo",
                "mystic": "Red Nimo"
            },
            "000110": {
                "global": "Bubblemaker"
            },
            "000100": {
                "global": "Tiny Fan"
            },
            "001000": {
                "global": "Inkling"
            },
            "001010": {
                "global": "Gill"
            },
            "001100": {
                "global": "Seaslug"
            }
        },
        "tail": {
            "000010": {
                "global": "Koi",
                "mystic": "Kuro Koi",
                "japan": "Koinobori"
            },
            "000110": {
                "global": "Tadpole"
            },
            "000100": {
                "global": "Nimo"
            },
            "001010": {
                "global": "Navaga"
            },
            "001000": {
                "global": "Ranchu"
            },
            "001100": {
                "global": "Shrimp"
            }
        },
        "back": {
            "000010": {
                "global": "Hermit",
                "mystic": "Crystal Hermit"
            },
            "000100": {
                "global": "Blue Moon"
            },
            "000110": {
                "global": "Goldfish"
            },
            "001010": {
                "global": "Anemone"
            },
            "001000": {
                "global": "Sponge"
            },
            "001100": {
                "global": "Perch"
            }
        }
    },
    "bird": {
        "ears": {
            "001100": {
                "japan": "Karimata",
                "global": "Risky Bird"
            },
            "000010": {
                "global": "Pink Cheek",
                "mystic": "Heart Cheek"
            },
            "000100": {
                "global": "Early Bird"
            },
            "000110": {
                "global": "Owl"
            },
            "001010": {
                "global": "Curly"
            },
            "001000": {
                "global": "Peace Maker"
            }
        },
        "tail": {
            "001010": {
                "japan": "Omatsuri",
                "global": "Granma's Fan"
            },
            "000010": {
                "global": "Swallow",
                "mystic": "Snowy Swallow"
            },
            "000100": {
                "global": "Feather Fan"
            },
            "000110": {
                "global": "The Last One"
            },
            "001000": {
                "global": "Cloud"
            },
            "001100": {
                "global": "Post Fight"
            }
        },
        "back": {
            "000010": {
                "global": "Balloon",
                "mystic": "Starry Balloon"
            },
            "000110": {
                "global": "Raven"
            },
            "000100": {
                "global": "Cupid",
                "japan": "Origami"
            },
            "001000": {
                "global": "Pigeon Post"
            },
            "001010": {
                "global": "Kingfisher"
            },
            "001100": {
                "global": "Tri Feather"
            }
        },
        "horn": {
            "000110": {
                "global": "Trump"
            },
            "000010": {
                "global": "Eggshell",
                "mystic": "Golden Shell"
            },
            "000100": {
                "global": "Cuckoo"
            },
            "001000": {
                "global": "Kestrel"
            },
            "001010": {
                "global": "Wing Horn"
            },
            "001100": {
                "global": "Feather Spear",
                "xmas": "Spruce Spear"
            }
        },
        "mouth": {
            "000010": {
                "global": "Doubletalk",
                "mystic": "Mr. Doubletalk"
            },
            "000100": {
                "global": "Peace Maker"
            },
            "001000": {
                "global": "Hungry Bird"
            },
            "001010": {
                "global": "Little Owl"
            }
        },
        "eyes": {
            "000010": {
                "global": "Mavis",
                "mystic": "Sky Mavis"
            },
            "000100": {
                "global": "Lucas"
            },
            "001010": {
                "global": "Robin"
            },
            "001000": {
                "global": "Little Owl"
            }
        }
    },
    "reptile": {
        "eyes": {
            "001010": {
                "japan": "Kabuki",
                "global": "Topaz"
            },
            "000100": {
                "global": "Tricky"
            },
            "000010": {
                "global": "Gecko",
                "mystic": "Crimson Gecko"
            },
            "001000": {
                "global": "Scar",
                "japan": "Dokuganryu"
            }
        },
        "mouth": {
            "001000": {
                "global": "Razor Bite"
            },
            "000100": {
                "global": "Kotaro"
            },
            "000010": {
                "global": "Toothless Bite",
                "mystic": "Venom Bite"
            },
            "001010": {
                "global": "Tiny Turtle",
                "japan": "Dango"
            }
        },
        "ears": {
            "001000": {
                "global": "Small Frill"
            },
            "000110": {
                "global": "Curved Spine"
            },
            "000100": {
                "global": "Friezard"
            },
            "000010": {
                "global": "Pogona",
                "mystic": "Deadly Pogona"
            },
            "001010": {
                "global": "Swirl"
            },
            "001100": {
                "global": "Sidebarb"
            }
        },
        "back": {
            "001000": {
                "global": "Indian Star"
            },
            "000010": {
                "global": "Bone Sail",
                "mystic": "Rugged Sail"
            },
            "000100": {
                "global": "Tri Spikes"
            },
            "000110": {
                "global": "Green Thorns"
            },
            "001010": {
                "global": "Red Ear"
            },
            "001100": {
                "global": "Croc"
            }
        },
        "tail": {
            "000100": {
                "global": "Iguana"
            },
            "000010": {
                "global": "Wall Gecko",
                "mystic": "Escaped Gecko"
            },
            "000110": {
                "global": "Tiny Dino"
            },
            "001000": {
                "global": "Snake Jar",
                "xmas": "December Surprise"
            },
            "001010": {
                "global": "Gila"
            },
            "001100": {
                "global": "Grass Snake"
            }
        },
        "horn": {
            "000010": {
                "global": "Unko",
                "mystic": "Pinku Unko"
            },
            "000110": {
                "global": "Cerastes"
            },
            "000100": {
                "global": "Scaly Spear"
            },
            "001010": {
                "global": "Incisor"
            },
            "001000": {
                "global": "Scaly Spoon"
            },
            "001100": {
                "global": "Bumpy"
            }
        }
    },
    "plant": {
        "tail": {
            "001000": {
                "global": "Yam"
            },
            "000010": {
                "global": "Carrot",
                "mystic": "Namek Carrot"
            },
            "000100": {
                "global": "Cattail"
            },
            "000110": {
                "global": "Hatsune"
            },
            "001010": {
                "global": "Potato Leaf"
            },
            "001100": {
                "global": "Hot Butt"
            }
        },
        "mouth": {
            "000100": {
                "global": "Zigzag",
                "xmas": "Rudolph"
            },
            "000010": {
                "global": "Serious",
                "mystic": "Humorless"
            },
            "001000": {
                "global": "Herbivore"
            },
            "001010": {
                "global": "Silence Whisper"
            }
        },
        "eyes": {
            "000010": {
                "global": "Papi",
                "mystic": "Dreamy Papi"
            },
            "000100": {
                "global": "Confused"
            },
            "001010": {
                "global": "Blossom"
            },
            "001000": {
                "global": "Cucumber Slice"
            }
        },
        "ears": {
            "000010": {
                "global": "Leafy",
                "mystic": "The Last Leaf"
            },
            "000110": {
                "global": "Rosa"
            },
            "000100": {
                "global": "Clover"
            },
            "001000": {
                "global": "Sakura",
                "japan": "Maiko"
            },
            "001010": {
                "global": "Hollow"
            },
            "001100": {
                "global": "Lotus"
            }
        },
        "back": {
            "000110": {
                "global": "Bidens"
            },
            "000100": {
                "global": "Shiitake",
                "japan": "Yakitori"
            },
            "000010": {
                "global": "Turnip",
                "mystic": "Pink Turnip"
            },
            "001010": {
                "global": "Mint"
            },
            "001000": {
                "global": "Watering Can"
            },
            "001100": {
                "global": "Pumpkin"
            }
        },
        "horn": {
            "000100": {
                "global": "Beech",
                "japan": "Yorishiro"
            },
            "000110": {
                "global": "Rose Bud"
            },
            "000010": {
                "global": "Bamboo Shoot",
                "mystic": "Golden Bamboo Shoot"
            },
            "001010": {
                "global": "Cactus"
            },
            "001000": {
                "global": "Strawberry Shortcake"
            },
            "001100": {
                "global": "Watermelon"
            }
        }
    }
}
const apiUrl = 'https://axieinfinity.com/graphql-server-v2/graphql'

function getPartName(cls, part, region, binary) {
    let trait;
    if (binary in binarytraits[cls][part]) {
        if (region in binarytraits[cls][part][binary]) {
            trait = binarytraits[cls][part][binary][region];
        } else if ("global" in binarytraits[cls][part][binary]) {
            trait = binarytraits[cls][part][binary]["global"];
        } else {
            trait = "UNKNOWN Regional " + cls + " " + part;
        }
    } else {
        trait = "UNKNOWN " + cls + " " + part;
    }
    return trait;
}

function getPartsFromGroup(part, group, region) {
    let dClass = classGeneMap[group.slice(2, 6)];
    let dBin = group.slice(6, 12);
    let dID = getPartName(dClass, part, region, dBin);

    let r1Class = classGeneMap[group.slice(12, 16)];
    let r1Bin = group.slice(16, 22);
    let r1ID = getPartName(r1Class, part, region, r1Bin);

    let r2Class = classGeneMap[group.slice(22, 26)];
    let r2Bin = group.slice(26, 32);
    let r2ID = getPartName(r2Class, part, region, r2Bin);

    return {d: dID, r1: r1ID, r2: r2ID};
}

function getRegionFromGroup(group) {
    let regionBin = group.slice(8, 13);
    if (regionBin in regionGeneMap) {
        return regionGeneMap[regionBin];
    }
    return "Unknown Region";
}

function strMul(str, num) {
    var s = "";
    for (var i = 0; i < num; i++) {
        s += str;
    }
    return s;
}

function genesToBin(genes) {
    let genesString = genes.toString(2);
    genesString = strMul("0", 256 - genesString.length) + genesString
    return genesString;
}

function getTraits(genes) {
    const groups = [genes.slice(0, 32), genes.slice(32, 64), genes.slice(64, 96), genes.slice(96, 128), genes.slice(128, 160), genes.slice(160, 192), genes.slice(192, 224), genes.slice(224, 256)];
    let region = getRegionFromGroup(groups[0]);
    let eyes = getPartsFromGroup("eyes", groups[2], region);
    let mouth = getPartsFromGroup("mouth", groups[3], region);
    let ears = getPartsFromGroup("ears", groups[4], region);
    let horn = getPartsFromGroup("horn", groups[5], region);
    let back = getPartsFromGroup("back", groups[6], region);
    let tail = getPartsFromGroup("tail", groups[7], region);
    return {eyes: eyes, mouth: mouth, ears: ears, horn: horn, back: back, tail: tail};
}

function getBigNumberString(str) {
    return new BigNumber(str).toString(2);
}

function getTraitsFromString(str) {
    return getTraits(genesToBin(getBigNumberString(str)))
}

function generateGraphqlQuery() {
    return `query GetAxieBriefList(
  $auctionType: AuctionType
  $criteria: AxieSearchCriteria
  $from: Int
  $sort: SortBy
  $size: Int
  $owner: String
) {
  axies(
    auctionType: $auctionType
    criteria: $criteria
    from: $from
    sort: $sort
    size: $size
    owner: $owner
  ) {
    total
    results {
      ...AxieBrief
      __typename
    }
    __typename
  }
}
fragment AxieBrief on Axie {
  id
  class
  breedCount
  genes
  sireId
  matronId
  battleInfo {
    banned
    __typename
  }
  auction {
    currentPrice
    currentPriceUSD
    __typename
  }
}`
}

function generateGraphqlVariable(part, axieClass) {
    return {
        "from": 0,
        "size": 3000,
        "sort": "PriceAsc",
        "auctionType": "Sale",
        "owner": null,
        "criteria": {
            "region": null,
            "parts": [part],
            "bodyShapes": null,
            "classes": [axieClass],
            "stages": null,
            "numMystic": null,
            "pureness": null,
            "title": null,
            "breedable": null,
            "breedCount": [0, 0],
            "hp": [],
            "skill": [],
            "speed": [],
            "morale": []
        }
    }
}

async function findBestAxies(parts, axieClass, maxPriceInUsd, minHighChance) {
    const axies = [];
    const pairs = {};
    for (const part of parts) {
        const res = await axios({
            method: 'POST',
            url: apiUrl,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            data: JSON.stringify({
                query: generateGraphqlQuery(),
                variables: generateGraphqlVariable(part, axieClass)
            })
        });
        res.data.data.axies.results.map(axie => {
            const price = parseFloat(axie.auction.currentPriceUSD);
            const trait = getTraitsFromString(axie.genes);
            const id = axie.id;
            axies.push({
                price,
                trait,
                sireId: axie.sireId,
                matronId: axie.matronId,
                id
            })
        })
    }

    axies.forEach(father => {
        axies.forEach(mother => {
            // not sibling
            if ((father.sireId === mother.sireId) && (father.matronId === mother.matronId)) {
                return;
            }
            if (father.id === mother.id) {
                return;
            }
            if (pairs[father.id + '-' + mother.id] || pairs[mother.id + '-' + father.id]) {
                return;
            }
            if ((father.price + mother.price) > maxPriceInUsd) {
                return;
            }
            const combinedId = father.id + '-' + mother.id;
            const scorePerParts = parts.reduce((acc, part) => {
                let totalPercentage = 0;

                const partArr = part.split('-');
                const bodyPart = partArr[0];
                const partName = partArr.slice(1).join(' ').toLowerCase();

                const fatherD = father.trait[bodyPart]['d'].toLowerCase();
                if (fatherD === partName) {
                    totalPercentage += 37.5;
                }
                const motherD = mother.trait[bodyPart]['d'].toLowerCase();
                if (motherD === partName) {
                    totalPercentage += 37.5;
                }

                const fatherR1 = father.trait[bodyPart]['r1'].toLowerCase();
                if (fatherR1 === partName) {
                    totalPercentage += 9.375;
                }
                const motherR1 = mother.trait[bodyPart]['r1'].toLowerCase();
                if (motherR1 === partName) {
                    totalPercentage += 9.375;
                }

                const fatherR2 = father.trait[bodyPart]['r2'].toLowerCase();
                if (fatherR2 === partName) {
                    totalPercentage += 3.125;
                }
                const motherR2 = mother.trait[bodyPart]['r2'].toLowerCase();
                if (motherR2 === partName) {
                    totalPercentage += 3.125;
                }

                acc[part] = totalPercentage;
                return acc;
            }, {});
            const maxScore = Object.values(scorePerParts).reduce((acc, score) => {
                return acc + score;
            }, 0);
            const totalPrice = father.price + mother.price;

            pairs[combinedId] = {
                maxScore,
                scorePerParts,
                father,
                mother,
                totalPrice
            };
        })
    });

    const defaultPairs = Object.values(pairs).map(each => {
        return {
            maxScore: each.maxScore,
            scorePerParts: each.scorePerParts,
            totalPrice: each.totalPrice,
            father: {
                price: each.father.price,
                id: each.father.id
            },
            mother: {
                price: each.mother.price,
                id: each.mother.id
            }
        }
    });
    const mostAllPartsPercentagePairs = defaultPairs.sort((a, b) => {
        return b.maxScore - a.maxScore;
    })
    const highChanceAllParts = defaultPairs.filter(each => {
        for(const score of Object.values(each.scorePerParts)) {
            if (score < minHighChance) {
                return false;
            }
        }
        return true;
    }).sort((a, b) => {
        return a.totalPrice - b.totalPrice;
    });


    console.log('-------WRITING ORIGINAL-------');
    fs.writeFileSync('result/original.json', JSON.stringify(defaultPairs));

    console.log('-------WRITING SORT BY MOST-------');
    fs.writeFileSync('result/sort-by-most.json', JSON.stringify(mostAllPartsPercentagePairs));

    for (const part of parts) {
        console.log(`-------WRITING SORT BY ${part.toUpperCase()}-------`);
        const mostPartPercentagePairs = defaultPairs.sort((a, b) => {
            return b.scorePerParts[part] - a.scorePerParts[part];
        });
        fs.writeFileSync(`result/sort-by-${part}.json`, JSON.stringify(mostPartPercentagePairs));
    }

    console.log('--------CHEAPEST HIGH CHANCE ALL PARTS--------');
    fs.writeFileSync('result/high-chance-all-parts.json', JSON.stringify(highChanceAllParts));
}

function action(options) {
    const parts = options.parts.split(',');
    const axieClass = options.class;
    const maxPriceInUsd = parseFloat(options.maxPrice);
    const minHighChance = parseFloat(options.minHighChance);
    return findBestAxies(parts, axieClass, maxPriceInUsd, minHighChance).then(() => {
        console.log('-----END------');
    }, (err) => {
        console.log(err);
    })
}

module.exports = function runCommand(program) {
    program
        .command('find-axies-by-parts')
        .option('-p, --parts <names>', 'parts that we want in the form of comma separated part-(part-name)', 'tail-grass-snake,back-furball')
        .option('-c, --class <class>', 'class name', 'Reptile')
        .option('-mp, --max-price <price>', 'Max price in USD', '800')
        .option('-mc, --min-high-chance <chance>', 'Min High Chance', '40')
        .action(action)
};