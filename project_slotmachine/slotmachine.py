import math
import random
import itertools

import numpy as np
from random import choices
# noinspection PyTypeChecker
class SlotMachine:
    #drums is a number of drums in slot
    #possibilities is dict {element: [possibility]} e.g. {"cherry": [0.5,0.5,0.5], "banana": [0.3,0.3,0.3], "apple":[0.2,0.2,0.2]}, sum of possibilities should be 1
    #wincoef is dict looks like {"cherry": 10, "banana": 5, "apple":2}, describing earn coefficient for user
    def __init__(self, drums, height, possibilities, wincoef):
        self.drums = drums
        self.possibilities = possibilities
        self.wincoef = wincoef
        self.height = height

    def checkParameters(self):
        if (sum(self.possibilities.values()) != 1):
            return False
        return True

    #generate transposed matrix which will demonstrate rows as arrays
    def transposeResultTable(self, table):
        arr = np.array(table)
        return arr.transpose().tolist()

    def roll(self):
        resultTable = []
        for drum in range(self.drums):
            drumResults = []
            for row in range(self.height):
                possibilitiesArray = []
                probabilites = list(self.possibilities.values())
                for i in probabilites:
                    possibilitiesArray.append(i[drum])
                symbols = list(self.possibilities.keys())
                drumResults.append(random.choices(symbols,possibilitiesArray)[0])
            resultTable.append(drumResults)
        return self.transposeResultTable(resultTable)

    #table is a transposed result table from roll() function
    def calculateWinning(self, table, bet):
        winning = 0
        # check on three in a row
        for row in table:
            for i in range(len(row)-2):
                if (row[i] == row[i+1] and row[i+1] == row[i+2]):
                    winning += bet * self.wincoef[row[i]]

        transposed = self.transposeResultTable(table)

        #check three in a neighbour columns
        for column in range(len(transposed)-2):
            for i in transposed[column]:
                for j in transposed[column+1]:
                    for k in transposed[column+2]:
                        if k==i and i==j:
                            winning += 0.5 * bet * self.wincoef[i]

        #clusters winning
        clusters = self.find_clusters(table)
        for cluster in clusters:
            winning += 0.02*len(cluster)*bet*self.wincoef[table[cluster[0][0]][cluster[0][1]]]

        return round(winning,3)

    def countMonteCarlo(self):
        bet = 1
        total_bet = 0
        total_payout = 0
        games = 10000
        for i in range(games):
            result = self.calculateWinning(self.roll(),bet)
            total_bet += bet
            total_payout += result
        payback_percentage = (total_payout / total_bet) * 100
        return payback_percentage

    def find_clusters(self,board):
        clusters = []
        rows = len(board)
        cols = len(board[0])
        visited = set()

        def dfs(i, j, symbol, cluster):
            if i < 0 or i >= rows or j < 0 or j >= cols:
                return
            if (i, j) in visited:
                return
            if board[i][j] != symbol:
                return
            visited.add((i, j))
            cluster.append((i, j))
            dfs(i - 1, j, symbol, cluster)
            dfs(i, j - 1, symbol, cluster)
            dfs(i, j + 1, symbol, cluster)
            dfs(i + 1, j, symbol, cluster)

        for i in range(rows):
            for j in range(cols):
                if (i, j) in visited:
                    continue
                cluster = []
                dfs(i, j, board[i][j], cluster)
                if len(cluster) >= 4:
                    clusters.append(cluster)

        return clusters

    def calculateWinning1(self, table, bet):
        winning = 0
        # check on three in a row
        for row in table:
            for i in range(len(row)-2):
                if (row[i] == row[i+1] and row[i+1] == row[i+2]):
                    winning += bet * row[i]

        transposed = self.transposeResultTable(table)

        #check three in a neighbour columns
        for column in range(len(transposed)-2):
            for i in transposed[column]:
                for j in transposed[column+1]:
                    for k in transposed[column+2]:
                        if k==i and i==j:
                            winning += 0.5 * bet * i

        #clusters winning
        clusters = self.find_clusters(table)
        for cluster in clusters:
            winning += 0.02*len(cluster)*bet*table[cluster[0][0]][cluster[0][1]]

        return round(winning,3)
    def generateAllTables(self):
        symbols = list(self.possibilities.keys())
        tables = itertools.product(symbols, repeat=self.drums*self.height)
        return tables

    def formatTable(self, table):
        tableList = list(table)
        n = self.drums
        tableChunked = [tableList[i * n:(i + 1) * n] for i in range((len(tableList) + n - 1) // n )]
        return tableChunked

    def countTheoryPayback(self):
        tables = self.generateAllTables()
        totalBet = 0
        totalWin = 0
        for i in tables:
            table = self.formatTable(i)
            totalBet += 1
            totalWin += self.calculateWinning(table, 1)
        return totalWin*100/totalBet

# poss = {"cherry": [0.5,0.5,0.5,0.5,0.5], "banana": [0.2,0.2,0.2,0.2,0.2], "apple":[0.2,0.2,0.2,0.2,0.2], "pear":[0.05,0.05,0.05,0.05,0.05], "nut": [0.05,0.05,0.05,0.05,0.05]}
# wincoef = {"cherry": 0.1, "banana": 0.25, "apple":0.25, "pear": 0.5, "nut": 0.5}
# slot = SlotMachine(3, 3, poss, wincoef)
# result = slot.roll()
# print(slot.countMonteCarlo())
# totalBet = 0
# totalWin = 0
# bet = 1
# for i in slot.generateAllTables():
#     table = slot.formatTable(i)
#     totalBet += bet
#     totalWin += slot.calculateWinning(table, bet)
# print(totalWin*100/totalBet)
