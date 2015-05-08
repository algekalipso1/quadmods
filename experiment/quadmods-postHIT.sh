#!/usr/bin/env sh
pushd /Users/andesgomez/Documents/Stanford/Autumn2013-Masters/PayedWork/aws-mturk-clt-1.3.1/bin
./loadHITs.sh $1 $2 $3 $4 $5 $6 $7 $8 $9 -label /Users/andesgomez/Documents/Stanford/quadmods/experiment/quadmods -input /Users/andesgomez/Documents/Stanford/quadmods/experiment/quadmods.input -question /Users/andesgomez/Documents/Stanford/quadmods/experiment/quadmods.question -properties /Users/andesgomez/Documents/Stanford/quadmods/experiment/quadmods.properties -maxhits 1
popd