# Requirments

*I requirments che seguiranno sono scritti in stile “Story”, per poter racchiudere in delle microstorie quello che vorremo poter fare con il cryptobot.*

*[Qui](https://app.lucidchart.com/invitations/accept/e74902e5-4a2f-47ec-b745-41186374c52e) è possibile vedere la struttura del database.* 

## Storia 1

**Dan** ha un **portfolio** (con accesso al suo **account binance**).

**Marco** ha un altro portfolio.

All'interno del portfolio ci sono **x soldi** (lo si vede dal balance binance). Dan vuole usare il **suo portfolio** per tradare una **coppia di monete** (es. BTC/ETH) ad un **timeframe giornaliero** usando **l'indicatore** td.

## Storia 2

Voglio poter tradare su **più exchange** diversi. Ad esempio voglio poter usare una strategia contemporaneamente su Binance e Coinbase, mentre un altra solo su Binance.

Voglio avere **conti diversi**. Quindi per una strategia usare un conto con **20 dollari di budget** e per un’altra un conto con 40 dollari.

Oppure una strategia con timeframe 1h con 20$ di budget e una strategia con timeframe 1d con 50$ budget.

## Storia 3

Voglio seguire tutti gli scambi delle mie strategie, quindi se ho cominciato con budget di 20$ e ho guadagnato 2$, poi vendo e reinvesto devo sapere che il mio 100% è 22 non 20.(Devo tenere traccia delle fee pagate nei calcoli)

## Storia 4

Ogni volta che avviene un trade mi deve arrivare un messagio su telegram.

## Storia 5

Voglio avere una **dashboard** dove **diversi utenti** si possono loggare. 

(Se è la prima volta che si autenticano devono cambiare password e possono resettarsi la password se non la ricordano).

## Storia 6

Una volta loggato voglio poter aggiungere un account di Binance o altri, voglio poter creare una strategia scegliendo un indicatore e impostando: timeframe, budget, un account e un asset. **(SOLO ADMIN)**

Voglio vedere le mie strategie attive.  **(SOLO ADMIN)**

Voglio poter mettere in pausa una strategia. **(SOLO ADMIN)**

## Storia 7

Voglio vedere i log degli acquisti e delle vendite della mia strategia.

Voglio vedere come sta andando la mia strategia: se sto guadagnando o meno e quanto.

## Storia 8

Se sono admin voglio poter **aggiungere altri utenti** e **selezionare se sono admin** o utenti con solo diritti in lettura.

## Storia 9

Voglio poter vedere tutti gli indicatori disponibili. **(SOLO ADMIN)**

## Storia 10

Ogni *minuto* deve girare un cronjob per ogni specifico indicatore. Questo job deve prednere tutte le strategia che lo usano. Deve guardare il timeframe di ogni strategia e verificare che non ha già runnato questa strategia in un range di tempo che equivale il timeframe impostato.

ES: Imposto una strategia con indicatore *td* a *1d*. Parte il cronjob e controlla che nell'ultimo giorno questa strategia non è stata azionata. Questa strategia non è stata azionata quindi l'aziona e segue algoritmo della strategia. Il minuto dopo parte dinnuovo il cron e verifica questa volta che la strategia è già stata azionata nell'ultimo giorno quindi non l'aziona. Cosi fino al giorno dopo.

Il cronjob deve creare un job per ogni strategia che trova per quell'indicatore e gestirle tutte contemporaneamente.

## Storia 11

Se sono un admin all'interno della dashboard posso vedere una sezione per poter aggiungere account (es api binance Binance), poter vedere i propri account, togliere un account.
